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

  private currentDateHabitLogs: IHabitCompletionLog[];
  private currentUserId: number;
  private wellnessRecordId: number;
  private journalRecordId: number;
  private newWellnessEntry: boolean;
  private newJournalEntry: boolean;
  private newHabitLogEntry: boolean;
  previousDailyReview: boolean;

  dateParam: string | null;
  noHabits: boolean;
  currentUserHabits: Habit[] = [];
  wellnessRatingForm!: FormGroup;
  guidedJournalForm!: FormGroup;
  habitReviewForm!: FormGroup;
  currentDate: string;


  ngOnInit(): void {

    this.dateParam = this.activatedRoute.snapshot.paramMap.get('date');
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.noHabits = false;
    this.setDate();
    this.initializeForms();
    this.checkIfRatingsExist(this.currentDate);
    this.checkIfHabitLogsExist();
    this.checkIfGuidedJournalExist();
    
  }

  setDate(): void {
    if (this.dateParam) {
      this.previousDailyReview = true;
      this.currentDate = this.dateParam;
    }
    else {
      this.previousDailyReview = false;
      let date = new Date();
     this.currentDate =  date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year:"numeric"
      });
      this.currentDate = this.currentDate.replace(/(\d+)\/(\d+)\/(\d+)/, "$1-$2-$3"); 
      console.log('current date', this.currentDate)
    }
  }
  checkIfRatingsExist(date: string) {

    this.accountService.getWellnessEntryByDate(
      date,
      this.currentUserId).
      pipe(take(1)).
      subscribe(ratingEntry => {
        //if rating entries exist for current date
        if (ratingEntry.length !== 0) {
          this.newWellnessEntry = false;
          this.wellnessRecordId = ratingEntry[0].id;
          console.log("entry already exist");
          this.wellnessRatingForm.patchValue(ratingEntry[0]);
        } else {
          this.newWellnessEntry = true;
          console.log("currentdate entry does not exist");
        }
      });

  }
  checkIfHabitLogsExist() {

    this.accountService.getCurrentDateHabitLogEntries(
      this.currentDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(logs => {
        //save logs for later http call
        this.currentDateHabitLogs = logs;

        if (logs.length !== 0) {
          //if logs exist for currentDate, loop through the FormControls and add the existing log values to the form
          for (let i = 0; i < logs.length; i++) {
            let habitId = logs[i].habitId;
            let currentControl = this.habitReviewForm.get(habitId.toString());
            currentControl?.setValue(logs[i].completed);
          }

          this.newHabitLogEntry = false;
          console.log("habit entry already exist");

        } else {
          this.newHabitLogEntry = true;
          console.log("habit logs do not exist for current date - using default values");
        }
      });

  }
  checkIfGuidedJournalExist() {
    this.accountService.getCurrentDateJournalEntry(
      this.currentDate,
      this.currentUserId).
      pipe(take(1)).
      subscribe(journalEntry => {
        //if rating entries exist for current date
        if (journalEntry.length !== 0) {
          this.newJournalEntry = false;
          this.journalRecordId = journalEntry[0].id;
          console.log("journal entry already exist", journalEntry[0]);
          this.guidedJournalForm.patchValue(journalEntry[0]);

        } else {
          this.newJournalEntry = true;
          console.log("currentdate entry does not exist");
        }
      });
  }
  submit() {
    console.log("review submit called");
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
        .subscribe();
    } else if (this.newWellnessEntry === false) {
      console.log("new entry false");

      this.accountService.getWellnessEntryByDate(
        this.currentDate,
        this.currentUserId
      ).
        pipe(take(1)).
        subscribe(guidedJournalEntry => {

          if (guidedJournalEntry.length !== 0) {
            //update the existing currentDate wellness entry with the Forms data
            this.journalRecordId = guidedJournalEntry[0].id;
            guidedJournalFormData.id = this.journalRecordId;
            this.accountService.updateGuidedjournalData(guidedJournalFormData).
              pipe(take(1)).
              subscribe(() => {
                console.log("jounral form update success");

              });

          }
        });//end subscribe
    }

  }
  submitHabitReviewForm() {
    let habitLogs: IHabitCompletionLog[] = [];

    if (this.newHabitLogEntry === true) {

      Object.keys(this.habitReviewForm.controls).forEach(key => {
        console.log(
          "keys =",
          key,
          this.habitReviewForm.controls[key].value
        );
        habitLogs.push({
          id: 0,
          userId: this.currentUserId,
          habitId: Number(key),
          completed: this.habitReviewForm.controls[key].value,
          date: this.currentDate
        });
      });

      this.accountService.addHabitCompletionLogs(habitLogs);

    } else if (this.newHabitLogEntry === false) {

      console.log("form before controls = ", this.currentDateHabitLogs);
      Object.keys(this.habitReviewForm.controls).forEach(key => {
        this.currentDateHabitLogs.forEach((log) => {
          if (key === log.habitId.toString()) {
            log.completed = this.habitReviewForm.controls[key].value;
          }
        });
        console.log("keys =", key, this.habitReviewForm.controls[key].value);

      });
    }
    this.accountService.updateHabitCompletionLogs(this.currentDateHabitLogs);

  }

  submitWellnessRatingForm() {
    const wellnessFormData: IWellnessRating = this.wellnessRatingForm.getRawValue();

    if (this.newWellnessEntry === true) {

      this.newWellnessEntry = false;

      this.accountService.addWellnessRatingEntry(wellnessFormData)
        .pipe(take(1))
        .subscribe();
    } else if (this.newWellnessEntry === false) {
      console.log("new entry false");

      this.accountService.getWellnessEntryByDate(
        this.currentDate,
        this.currentUserId
      ).
        pipe(take(1)).
        subscribe(wellnessEntry => {

          if (wellnessEntry.length !== 0) {
            //update the existing currentDate wellness entry with the Forms data
            this.wellnessRecordId = wellnessEntry[0].id;
            wellnessFormData.id = this.wellnessRecordId;
            this.accountService.updateWellnessData(wellnessFormData).
              pipe(take(1)).
              subscribe(() => {
                console.log("form update success");
             
              });

          }
        });//end subscribe
    }
  }

  initializeForms() {

    this.habitReviewForm = this.fb.group({});

    //Initialize the habit form with the users saved habits, and generate a control for each
    this.accountService.getHabitsForCurrentUser(this.currentUserId).
      pipe(take(1)).
      subscribe(habits => {
        if (habits.length !== 0) {
          habits.forEach(habit => {
            this.currentUserHabits.push(habit);
            this.habitReviewForm.addControl(habit.id.toString(), new FormControl(false));
          });
        }
        else {
          this.noHabits = true;
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
      userId: this.currentUserId,
      date: this.currentDate
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
      date: this.currentDate
    });

    this.guidedJournalForm = this.fb.group({
      id: 0,
      userId: this.currentUserId,
      date: this.currentDate,
      gratitudeEntry: ['', Validators.required],
      highlightEntry: ['', Validators.required],
      learnedEntry: ['', Validators.required],
      contributeEntry: ['', Validators.required],
      generalEntry: ['', Validators.required],

    });

  }

  //wellness form getters for template access 
  get exerciseRating() {
    return this.wellnessRatingForm.get('exerciseRating')?.value
  }
  get sunlightRating() {
    return this.wellnessRatingForm.get("sunlightRating")?.value;
  }
  get sleepRating() {
    return this.wellnessRatingForm.get("sleepRating")?.value;
  }
  get nutritionRating() {
    return this.wellnessRatingForm.get("nutritionRating")?.value;
  }
  get stressRating() {
    return this.wellnessRatingForm.get("stressRating")?.value;
  }
  get mindfulnessRating() {
    return this.wellnessRatingForm.get("mindfulnessRating")?.value;
  }
  get productivityRating() {
    return this.wellnessRatingForm.get("productivityRating")?.value;
  }
  get moodRating() {
    return this.wellnessRatingForm.get("moodRating")?.value;
  }
  get energyRating() {
    return this.wellnessRatingForm.get("energyRating")?.value;
  }
  get overallDayRating() {
    return this.wellnessRatingForm.get("overallDayRating")?.value;
  }

  setDisabled() {
    for (const controlName in this.wellnessRatingForm.controls) {
      if (this.wellnessRatingForm.controls.hasOwnProperty(controlName)) {
        const control = this.wellnessRatingForm.controls[controlName];
        control.disable();
        //console.log(control);
      }
    }
    for (const controlName in this.guidedJournalForm.controls) {
      if (this.guidedJournalForm.controls.hasOwnProperty(controlName)) {
        const control = this.guidedJournalForm.controls[controlName];
        control.disable();
        //console.log(control);
      }
    }
  }


}


