import { Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { IWellnessRating } from 'src/app/models/IWellnessRating';
import { forkJoin, Observable, of, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/IHabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';
import { ActivatedRoute } from '@angular/router';
import { IGuidedJournalLog } from 'src/app/models/IGuidedJournalLog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-review',
  templateUrl: './daily-review.component.html',
  styleUrls: ['./daily-review.component.less']
})
export class DailyReviewComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) { }
  private entryDateHabitLogs: IHabitCompletionLog[];
  private entryDateJournalLogs: IGuidedJournalLog[];
  private currentUserId: string;

  journalLogs$: Observable<IGuidedJournalLog[]>;
  rating$: Observable<IWellnessRating>;
  habits$: Observable<IHabitCompletionLog[]>;
  habitsFormGroup: FormGroup;
  wellnessEntry: IWellnessRating[] = [];
  displayStyle: string;
  isFormDisabled: boolean = false;
  previousDailyReview: boolean;
  dateParam: string | null;
  habits: Habit[] = [];
  journalEntries: IGuidedJournalEntry[] = [];
  wellnessRatingForm!: FormGroup;
  habitReviewForm!: FormGroup;
  modalJournalEntries: IGuidedJournalEntry[];
  modalHabits: Habit[];
  entryDate: string;
  deletedHabits: Habit[] = [];
  deletedJournalEntries: IGuidedJournalEntry[] = [];
  formType: string;
  guidedJournalForm!: FormGroup;
  modalForm = this.fb.group({
    items: new FormArray([]),
    addItemInput: new FormControl('')
  });

  @ViewChildren('modalTemplate') inputtedValues: QueryList<ElementRef>;
  ngOnInit(): void {

    this.dateParam = this.activatedRoute.snapshot.paramMap.get('date');
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.setEntryDate();
    this.initializeForms();
    this.setFormInputValues();
  }

  setEntryDate(): void {

    if (this.dateParam && !this.isToday(new Date(this.dateParam))) {
      this.previousDailyReview = true;
      this.entryDate = this.dateParam;
    }
    else {
      this.previousDailyReview = false;
      let date = new Date();
      let month = date.getMonth() + 1; // getMonth() returns a zero-based index, so we need to add 1 to get the correct month
      let day = date.getDate();
      let year = date.getFullYear();
      this.entryDate = month + "-" + day + "-" + year;
    }
  }

  submit() {

    this.submitWellnessRatingForm();
    this.submitHabitReviewForm();
    this.submitGuidedJournalForm();
    forkJoin([this.rating$, this.habits$, this.journalLogs$])
      .pipe(
        take(1)
      )
      .subscribe(() => {
        this.alertService.success("Entries Submitted Successfully");
      });
  }
  submitGuidedJournalForm() {

    if (this.entryDateJournalLogs.length === 0) {

      Object.keys(this.guidedJournalForm.controls).forEach(controlName => {
        const control = this.guidedJournalForm.controls[controlName];
        this.entryDateJournalLogs.push({
          id: '',
          userId: this.currentUserId,
          entryId: controlName,
          entryTextValue: control.value,
          date: this.entryDate
        });

      });


      this.journalLogs$ = this.accountService.addJournalRecordLogs(this.entryDateJournalLogs)
        .pipe(take(1));



    }
    else if (this.entryDateJournalLogs.length > 0) {

      Object.keys(this.guidedJournalForm.controls).forEach(controlName => {
        this.entryDateJournalLogs.forEach(existingJournalLog => {
          if (existingJournalLog.entryId.toString() === controlName) {
            existingJournalLog.entryTextValue = this.guidedJournalForm.controls[controlName].value;
          }
        });
      }
      );


      this.journalLogs$ = this.accountService.updateJournalRecordLogs(this.entryDateJournalLogs)
        .pipe(take(1));


    }
  }

  submitHabitReviewForm() {

    if (this.entryDateHabitLogs.length === 0) {

      Object.keys(this.habitReviewForm.controls).forEach(controlName => {

        this.entryDateHabitLogs.push({
          id: '',
          userId: this.currentUserId,
          habitId: controlName,
          completed: this.habitReviewForm.controls[controlName].value,
          date: this.entryDate
        });
      });

      this.habits$ = this.accountService.addHabitCompletionLogs(this.entryDateHabitLogs)
        .pipe(take(1));
    }
    else if (this.entryDateHabitLogs.length > 0) {

      Object.keys(this.habitReviewForm.controls).forEach(controlName => {
        this.entryDateHabitLogs.forEach((existingHabitLog) => {
          if (controlName === existingHabitLog.habitId.toString()) {
            existingHabitLog.completed = this.habitReviewForm.controls[controlName].value;
          }
        });
      });
      this.habits$ = this.accountService.updateHabitCompletionLogs(this.entryDateHabitLogs)
        .pipe(take(1));
    }

  }

  submitWellnessRatingForm() {
    const wellnessFormData: IWellnessRating = this.wellnessRatingForm.getRawValue();
    of({}).pipe(take(1));

    if (this.wellnessEntry.length === 0) {

      this.rating$ = this.accountService.addWellnessRatingEntry(wellnessFormData)
        .pipe(take(1));

    }
    else if (this.wellnessEntry.length > 0) {
      wellnessFormData.id = this.wellnessEntry[0].id;
      this.rating$ = this.accountService.updateWellnessData(wellnessFormData).
        pipe(take(1));

    }
  }
  initializeForms() {
    this.habitReviewForm = this.fb.group({});
    this.accountService.getHabits(this.currentUserId).
      pipe(take(1)).
      subscribe(habits => {
        if (habits.length > 0) {
          habits.forEach(habit => {
            this.habits.push(habit);
            this.habitReviewForm.addControl(habit.id, new FormControl(false));
          });
        }
      });

    this.wellnessRatingForm = this.fb.group({
      id: 0,
      sleepRating: [1, Validators.required],
      exerciseRating: [1, Validators.required],
      nutritionRating: [1, Validators.required],
      stressRating: [1, Validators.required],
      sunlightRating: [1, Validators.required],
      mindfulnessRating: [1, Validators.required],
      productivityRating: [1, Validators.required],
      moodRating: [1, Validators.required],
      energyRating: [1, Validators.required],
      overallDayRating: [1, Validators.required],
      userId: this.currentUserId,
      date: this.entryDate
    });
    this.guidedJournalForm = this.fb.group({});
    this.accountService.getJournalEntry(this.currentUserId).
      pipe(take(1)).
      subscribe(entry => {
        if (entry.length !== 0) {
          entry.forEach(entry => {
            this.journalEntries.push(entry);
            this.guidedJournalForm.addControl(entry.id, new FormControl(''));
          });
        }
      });
  }

  setFormInputValues() {
    //sets the values of all the forms to any existing values in the db for todays date
    this.setGuidedJournalFormValues();
    this.setHabitReviewFormValues();
    this.setWellnessRatingFormValues();
  }

  setGuidedJournalFormValues() {
    this.accountService.getJournalLogEntries(
      this.entryDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(journalLogs => {
        this.entryDateJournalLogs = journalLogs;
        if (journalLogs.length > 0) {

          for (let i = 0; i < journalLogs.length; i++) {
            let currentControl = this.guidedJournalForm.get(journalLogs[i].entryId);
            currentControl?.setValue(journalLogs[i].entryTextValue);
          }
          if (!this.isToday(new Date(this.entryDate))) {
            this.guidedJournalForm.disable();
          }
        }
      });
  }

  setWellnessRatingFormValues() {
    this.accountService.getWellnessEntryByDate(
      this.entryDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(wellnessRatings => {
        //if rating entries exist for current date
        this.wellnessEntry = wellnessRatings;
        if (wellnessRatings.length > 0) {

          this.wellnessRatingForm.patchValue(wellnessRatings[0]);
          if (!(this.isToday(new Date(this.entryDate)))) {
            this.wellnessRatingForm.disable();
          }
        }
      });
  }

  setHabitReviewFormValues() {
    this.accountService.getHabitLogEntries(
      this.entryDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(logs => {

        this.entryDateHabitLogs = logs;

        if (logs.length !== 0) {

          for (let i = 0; i < logs.length; i++) {
            let habitId = logs[i].habitId;
            let currentControl = this.habitReviewForm.get(habitId.toString());
            currentControl?.setValue(logs[i].completed);
          }

          if (!this.isToday(new Date(this.entryDate))) {
            this.habitReviewForm.disable();
          }
        }
      });
  }

  isToday(datePassed: Date) {
    const today = new Date();
    return (datePassed.getDate() === today.getDate() &&
      datePassed.getMonth() === today.getMonth() &&
      datePassed.getFullYear() === today.getFullYear())
  }

  openPopup(formType: string, content: TemplateRef<any>) {
    this.formType = formType;
    this.deletedJournalEntries = [];
    this.deletedHabits = [];
    this.modalForm.addControl('addItemInput', new FormControl(''));
    (<FormArray>this.modalForm.get('items')).clear();

    if (formType === 'journal') {
      this.modalJournalEntries = this.journalEntries.slice();
      this.modalJournalEntries.forEach(entry => {
        (<FormArray>this.modalForm.get('items')).push(new FormControl(entry.entryName))
      })

    }
    else if (formType === 'habits') {
      this.modalHabits = this.habits.slice();
      this.modalHabits.forEach(habit => {
        (<FormArray>this.modalForm.get('items')).push(new FormControl(habit.habitName))
      })
    }
    this.modalService.open(content, { size: 'md' });
  }

  deleteItem(index: number) {
    let formArray = this.modalForm.get('items') as FormArray;
    if (this.formType === 'journal') {
      this.modalJournalEntries[index].deleted = true;
      this.deletedJournalEntries.push(this.modalJournalEntries[index]);
      this.modalJournalEntries.splice(index, 1);
    }
    else if (this.formType === 'habits') {
      this.modalHabits[index].deleted = true;
      this.deletedHabits.push(this.modalHabits[index]);
      this.modalHabits.splice(index, 1);
    }
    formArray.removeAt(index);
  }

  update() {

    if (this.formType === 'journal') {

      let deletedEntries$ = this.deletedJournalEntries.length > 0 ?
        this.accountService.updateJournalRecordEntries(this.deletedJournalEntries)
          .pipe(take(1)) :
        of({}).pipe(take(1));

      let newModalEntries = this.modalJournalEntries.filter(entry => entry.id === '');
      let newEntries$ = newModalEntries.length > 0 ?
        this.accountService.addJournalRecordEntries(newModalEntries)
          .pipe(take(1)) :
        of({}).pipe(take(1));

      forkJoin([deletedEntries$, newEntries$])
        .pipe(take(1))
        .subscribe(() => {
          this.modalService.dismissAll();
        });
    }

    else if (this.formType === 'habits') {
      let deletedHabits$ = this.deletedHabits.length > 0 ?
        this.accountService.updateHabitEntries(this.deletedHabits)
          .pipe(take(1)) :
        of({}).pipe(take(1));

      let newModalHabits = this.modalHabits.filter(habit => habit.id === '');
      let newHabits$ = newModalHabits.length > 0 ?
        this.accountService.addHabitEntries(newModalHabits)
          .pipe(take(1)) :
        of({}).pipe(take(1));

      forkJoin([deletedHabits$, newHabits$])
        .pipe(take(1))
        .subscribe(() => {

          this.modalService.dismissAll();
        });

    }

    this.habits = [];
    this.journalEntries = [];
    this.initializeForms();
    this.setFormInputValues();
  }
  addItem() {

    if (this.formType === 'journal') {
      let newItem = this.modalForm.get('addItemInput')?.value;
      this.modalForm.get('addItemInput')?.setValue('');
      let newEntry: IGuidedJournalEntry = {
        id: '',
        userId: this.currentUserId,
        entryName: newItem ?? '',
        deleted: false
      };
      (<FormArray>this.modalForm.get('items')).push(new FormControl(newItem))
      this.modalJournalEntries.push(newEntry);
    }
    else if (this.formType === 'habits') {
      let newItem = this.modalForm.get('addItemInput')?.value;
      this.modalForm.get('addItemInput')?.setValue('');
      let newHabit: Habit = {
        id: '',
        userId: this.currentUserId,
        habitName: newItem ?? '',
        deleted: false
      };
      (<FormArray>this.modalForm.get('items')).push(new FormControl(newItem))
      this.modalHabits.push(newHabit);
    }
  }
}
