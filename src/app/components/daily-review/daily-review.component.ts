import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { catchError, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/HabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';

@Component({
  selector: 'app-daily-review',
  templateUrl: './daily-review.component.html',
  styleUrls: ['./daily-review.component.less']
})
export class DailyReviewComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  private currentDateHabitLogs: IHabitCompletionLog[];
  private currentUserId: number;
  private wellnessEntry: IWellnessRating[] | null;
  private journalRecordId: number;
  private newWellnessEntry: boolean;
  private newJournalEntry: boolean;
  private newHabitLogEntry: boolean;

  previousDailyReview: boolean;
  noHabits: boolean;
  displayDate = new Date();
  currentUserHabits: Habit[] = [];
  wellnessRatingForm!: FormGroup;
  guidedJournalForm!: FormGroup;
  habitReviewForm!: FormGroup;
  currentDate: string;


  ngOnInit(): void {
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.initializeForms();
    this.wellnessEntry = null;
    this.accountService.getCurrentDateWellnessEntry(
      this.currentDate,
      this.currentUserId
    )
      .pipe(take(1))
      .subscribe(wellnessEntry => {
        
        if (wellnessEntry.length !== 0) {
          //  this.wellnessRecordId = wellnessEntry[0].id;
          this.wellnessEntry = wellnessEntry;
        }
        
        this.noHabits = false;
        this.setCurrentDate();
       
        this.checkIfRatingsExist();
        this.checkIfHabitLogsExist();
        this.checkIfGuidedJournalExist();
      });

  }

  setCurrentDate(): void {

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    this.currentDate = `${day}-${month}-${year}`;
  }

  checkIfRatingsExist() {

    //if rating entries exist for current date
    if (this.wellnessEntry !== null && this.wellnessEntry.length !== 0) {
      this.newWellnessEntry = false;
      this.wellnessRatingForm.patchValue(this.wellnessEntry[0]);
    }
    else { this.newWellnessEntry = true; }
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

        }
        else {
          this.newJournalEntry = true;
          console.log("currentdate entry does not exist");
        }
      });
  }
  submit() {

    this.accountService.getCurrentDateWellnessEntry(
      this.currentDate,
      this.currentUserId
    )
      .pipe(take(1))
      .subscribe(wellnessEntry => {

        if (wellnessEntry !== null && wellnessEntry.length !== 0) {
          this.wellnessEntry = wellnessEntry;
        }
        this.submitWellnessRatingForm();
        this.submitHabitReviewForm();
        this.submitGuidedJournalForm();
      });

  }

  submitGuidedJournalForm() {

    let guidedJournalFormData: IGuidedJournalEntry = this.guidedJournalForm.getRawValue();
    if (this.newJournalEntry === true) {
      this.newJournalEntry = false;
      this.accountService.addJournalRecordEntry(guidedJournalFormData)
        .pipe(take(1))
        .subscribe();
    }
    else if (this.newWellnessEntry === false) {
      if (this.wellnessEntry !== null && this.wellnessEntry.length !== 0) {
        this.journalRecordId = this.wellnessEntry[0].id;
        guidedJournalFormData.id = this.journalRecordId;
        this.accountService.updateGuidedjournalData(guidedJournalFormData)
          .subscribe(() => {
            console.log("journal form update success");
            this.alertService.success('Journal Entry Successfully Updated');
          });
      }

    }

  }

  submitHabitReviewForm() {

    let habitLogs: IHabitCompletionLog[] = [];
    if (this.newHabitLogEntry === true) {
      Object.keys(this.habitReviewForm.controls).forEach(key => {
        habitLogs.push({
          id: 0,
          userId: this.currentUserId,
          habitId: Number(key),
          completed: this.habitReviewForm.controls[key].value,
          date: this.currentDate
        });
      });
      this.currentDateHabitLogs = habitLogs; 
      this.newHabitLogEntry = false;
      this.accountService.addHabitCompletionLogs(habitLogs);
    }
    else if (this.newHabitLogEntry === false) {
      console.log("form before controls = ", this.currentDateHabitLogs);
      Object.keys(this.habitReviewForm.controls).forEach(key => {
        this.currentDateHabitLogs.forEach((log) => {
          if (key === log.habitId.toString()) {
            log.completed = this.habitReviewForm.controls[key].value;
          }
        });
        console.log("keys =", key, this.habitReviewForm.controls[key].value);

      });
      this.accountService.updateHabitCompletionLogs(this.currentDateHabitLogs);
    }
  
    
   

  }

  submitWellnessRatingForm() {

    const wellnessFormData: IWellnessRating = this.wellnessRatingForm.getRawValue();
    if (this.newWellnessEntry === true) {
      this.newWellnessEntry = false;
      this.accountService.addWellnessRatingEntry(wellnessFormData)
        .pipe(take(1))
        .subscribe();
    }
    else if (this.newWellnessEntry === false) {
      if (this.wellnessEntry !== null && this.wellnessEntry.length !== 0) {
        wellnessFormData.id = this.wellnessEntry[0].id;
        this.accountService.updateWellnessData(wellnessFormData)
          .pipe(take(1))
          .subscribe(() => {
            console.log("form update success");
            this.alertService.success('Wellness Entry Successfully Updated');
          });
      }

    }
  }

  initializeForms() {
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
      overallDayRating:[1, Validators.required],
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
        else { this.noHabits = true; }
      });

    

  }

}


