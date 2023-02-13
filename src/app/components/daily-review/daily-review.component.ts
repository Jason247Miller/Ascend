import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/HabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/GuidedJournalEntry';
import { ActivatedRoute } from '@angular/router';
import { IGuidedJournalLog } from 'src/app/models/GuidedJournalLog';

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
    private activatedRoute: ActivatedRoute
  ) { }
  private entryDateJournalLogs: IGuidedJournalLog[]; 
  private entryDateHabitLogs: IHabitCompletionLog[];
  private currentUserId: number;
  private newWellnessEntry: boolean; 
  private newJournalLogEntry: boolean; 
  private newJournalEntry: boolean;
  private newHabitLogEntry: boolean;
 
  isFormDisabled: boolean = false;
  previousDailyReview: boolean;
  dateParam: string | null;
  noHabits: boolean;
  habits: Habit[] = [];
  journalEntries: IGuidedJournalEntry[] = [];
  wellnessRatingForm!: FormGroup;
  guidedJournalForm!: FormGroup;
  habitReviewForm!: FormGroup;
  entryDate: string;


  ngOnInit(): void {

    this.dateParam = this.activatedRoute.snapshot.paramMap.get('date');
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.noHabits = false;
    this.newHabitLogEntry, this.newJournalEntry, this.newWellnessEntry, this.newJournalLogEntry = false;
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
      this.entryDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
      });

      //format it to the type consistent throughout the application
      this.entryDate = this.entryDate.replace(/(\d+)\/(\d+)\/(\d+)/, "$1-$2-$3");
    }
  }

  submit() {

    this.submitWellnessRatingForm();
    this.submitHabitReviewForm();
    this.submitGuidedJournalForm();
  }
  submitGuidedJournalForm() {
    let guidedJournalFormData: IGuidedJournalEntry = this.guidedJournalForm.getRawValue();

    if (this.newJournalEntry === true) {
      this.newJournalEntry = false;
      this.accountService.addJournalRecordEntry(guidedJournalFormData)
        .pipe(take(1))
        .subscribe(() => { this.alertService.success("Added Journal Entries Successfully"); });
    }
    else if (this.newWellnessEntry === false) {
      this.accountService.getWellnessEntryByDate(
        this.entryDate,
        this.currentUserId
      ).
        pipe(take(1)).
        subscribe(guidedJournalEntry => {

          if (guidedJournalEntry.length !== 0) {
            //update the existing currentDate wellness entry with the Forms data
            guidedJournalFormData.id = guidedJournalEntry[0].id;
            this.accountService.updateGuidedjournalData(guidedJournalFormData).
              pipe(take(1)).
              subscribe(() => {
                this.alertService.success("Updated Journal Entries Successfully");
              });

          }
        });
    }

  }
  submitHabitReviewForm() {

    if (this.newHabitLogEntry === true) {

      Object.keys(this.habitReviewForm.controls).forEach(key => {

        this.entryDateHabitLogs.push({
          id: 0,
          userId: this.currentUserId,
          habitId: Number(key),
          completed: this.habitReviewForm.controls[key].value,
          date: this.entryDate
        });
      });

      this.newHabitLogEntry = false;
      this.accountService.addHabitCompletionLogs(this.entryDateHabitLogs);

    } else if (this.newHabitLogEntry === false) {

      console.log("form before controls = ", this.entryDateHabitLogs);
      Object.keys(this.habitReviewForm.controls).forEach(habitFormControl => {
        this.entryDateHabitLogs.forEach((log) => {
          if (habitFormControl === log.habitId.toString()) {
            log.completed = this.habitReviewForm.controls[habitFormControl].value;
          }
        });
      });
      this.accountService.updateHabitCompletionLogs(this.entryDateHabitLogs);
    }


  }

  submitWellnessRatingForm() {
    const wellnessFormData: IWellnessRating = this.wellnessRatingForm.getRawValue();
    if (this.newWellnessEntry === true) {
      this.newWellnessEntry = false;
      this.accountService.addWellnessRatingEntry(wellnessFormData)
        .pipe(take(1))
        .subscribe(() => { this.alertService.success("Added new Wellness Entry Successfully"); });
    }
    else if (this.newWellnessEntry === false) {
      this.accountService.getWellnessEntryByDate(this.entryDate, this.currentUserId)
        .pipe(take(1))
        .subscribe(wellnessEntry => {
          if (wellnessEntry.length !== 0) {
            wellnessFormData.id = wellnessEntry[0].id;
            this.accountService.updateWellnessData(wellnessFormData).
              pipe(take(1)).
              subscribe(() => { this.alertService.success("Updated Wellness Entry Successfully"); });
          }
        });
    }
  }
  initializeForms() {
    this.habitReviewForm = this.fb.group({});
    this.accountService.getHabits(this.currentUserId).
      pipe(take(1)).
      subscribe(habits => {
        if (habits.length !== 0) {
          habits.forEach(habit => {
            this.habits.push(habit);
            this.habitReviewForm.addControl(habit.id.toString(), new FormControl(false));
          });
        }
        else { 
          console.log("no habits is true")
          this.noHabits = true; }
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
    this.accountService.getJournalEntry( this.entryDate,this.currentUserId).
      pipe(take(1)).
      subscribe(entry => {
        if (entry.length !== 0) {
          entry.forEach(entry => {
            this.journalEntries.push(entry);
            this.guidedJournalForm.addControl(entry.id.toString(), new FormControl(entry.entryValue));
          });
        }
        else { console.log("no guided journals") }
      });


  }

  setFormInputValues() {
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

        if (journalLogs.length !== 0) {

          this.newJournalLogEntry = false;
          for (let i = 0; i < journalLogs.length; i++) {
            let journalId = journalLogs[i].entryId;
            let currentControl = this.guidedJournalForm.get(journalId.toString());
            currentControl?.setValue(journalLogs[i].entryTextValue);
          }
          //if entryDate is not currentdate, disable the form
          if (!this.isToday(new Date(this.entryDate))) {
            this.guidedJournalForm.disable();
          }
        }
        else { this.newJournalLogEntry = true; }
      });
    
  }

  setWellnessRatingFormValues() {
    this.accountService.getWellnessEntryByDate(
      this.entryDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(ratingEntry => {
        //if rating entries exist for current date
        if (ratingEntry.length !== 0) {
          this.newWellnessEntry = false;
          this.wellnessRatingForm.patchValue(ratingEntry[0]);
          if (!(this.isToday(new Date(this.entryDate)))) {
            console.log("in wellness rating - date is not current date")
            this.wellnessRatingForm.disable();
          }
        }
        else { this.newWellnessEntry = true; }
      });
  }

  setHabitReviewFormValues() {
    this.accountService.getHabitLogEntries(
      this.entryDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(logs => {
        //save logs for later http call
        this.entryDateHabitLogs = logs;

        if (logs.length !== 0) {

          this.newHabitLogEntry = false;
          for (let i = 0; i < logs.length; i++) {
            let habitId = logs[i].habitId;
            let currentControl = this.habitReviewForm.get(habitId.toString());
            currentControl?.setValue(logs[i].completed);
          }
          //if entryDate is not currentdate, disable the form
          if (!this.isToday(new Date(this.entryDate))) {
            this.habitReviewForm.disable();
          }
        }
        else { this.newHabitLogEntry = true; }
      });
  }

  isToday(datePassed: Date) {
    const today = new Date();
    return (datePassed.getDate() === today.getDate() &&
      datePassed.getMonth() === today.getMonth() &&
      datePassed.getFullYear() === today.getFullYear())
  }

}


