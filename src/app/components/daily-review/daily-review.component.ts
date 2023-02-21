import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { IWellnessRating } from 'src/app/models/IWellnessRating';
import { take } from 'rxjs';
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
export class DailyReviewComponent implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  private entryDateHabitLogs: IHabitCompletionLog[];
  private entryDateJournalLogs: IGuidedJournalLog[];
  private currentUserId: number;
  habitsFormGroup:FormGroup; 
  wellnessEntry: IWellnessRating[] = [];
  displayStyle: string;
  isFormDisabled: boolean = false;
  previousDailyReview: boolean;
  dateParam: string | null;
  noHabits: boolean;
  habits: Habit[] = [];
  journalEntries: IGuidedJournalEntry[] = [];
  wellnessRatingForm!: FormGroup;
  habitReviewForm!: FormGroup;
  modalJournalEntries: IGuidedJournalEntry[]; 
  modalHabits:Habit[]; 
  entryDate: string;
  deletedHabits:Habit[] = []; 
  deletedJournalEntries:IGuidedJournalEntry[] = []; 
  formType:string; 
  counter = 0; 
  modalForm = this.fb.group({
    items: new FormArray([]) ,
    addItemInput: new FormControl('')
  }); 

  guidedJournalForm!: FormGroup;
 




  ngAfterViewInit(): void {

   
  }
  
  @ViewChildren('modalTemplate') inputtedValues: QueryList<ElementRef>;
  ngOnInit(): void {
    this.displayStyle = 'none';
    this.dateParam = this.activatedRoute.snapshot.paramMap.get('date');
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    this.noHabits = false;
    this.setEntryDate();
    this.initializeForms();
    this.noHabits = false;
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

    if (this.entryDateJournalLogs.length === 0) {

      Object.keys(this.guidedJournalForm.controls).forEach(controlName => {
        const control = this.guidedJournalForm.controls[controlName];
        this.entryDateJournalLogs.push({
          id: 0,
          userId: this.currentUserId,
          entryId: Number(controlName),
          entryTextValue: control.value,
          date: this.entryDate
        });

        console.log(`Control name: ${controlName}, value: ${control.value}`);
      });

      this.accountService.addJournalRecordEntry(this.entryDateJournalLogs);

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
      this.accountService.updateGuidedjournalData(this.entryDateJournalLogs);
    }
  }


  submitHabitReviewForm() {

    if (this.entryDateHabitLogs.length === 0) {

      Object.keys(this.habitReviewForm.controls).forEach(key => {

        this.entryDateHabitLogs.push({
          id: 0,
          userId: this.currentUserId,
          habitId: Number(key),
          completed: this.habitReviewForm.controls[key].value,
          date: this.entryDate
        });
      });


      this.accountService.addHabitCompletionLogs(this.entryDateHabitLogs);

    } else if (this.entryDateHabitLogs.length > 0) {

      Object.keys(this.habitReviewForm.controls).forEach(controlName => {
        this.entryDateHabitLogs.forEach((existingHabitLog) => {
          if (controlName === existingHabitLog.habitId.toString()) {
            existingHabitLog.completed = this.habitReviewForm.controls[controlName].value;
          }
        });
      });
      this.accountService.updateHabitCompletionLogs(this.entryDateHabitLogs);
    }


  }

  submitWellnessRatingForm() {
    const wellnessFormData: IWellnessRating = this.wellnessRatingForm.getRawValue();
    if (this.wellnessEntry.length === 0) {

      this.accountService.addWellnessRatingEntry(wellnessFormData)
        .pipe(take(1))
        .subscribe(() => { this.alertService.success("Added new Wellness Entry Successfully"); });
    }
    else if (this.wellnessEntry.length > 0) {

      wellnessFormData.id = this.wellnessEntry[0].id;
      this.accountService.updateWellnessData(wellnessFormData).
        pipe(take(1)).
        subscribe(() => { this.alertService.success("Updated Wellness Entry Successfully"); });
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
            this.habitReviewForm.addControl(habit.id.toString(), new FormControl(false));
          });
        }
        else {
          console.log("no habits is true")
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
           this.guidedJournalForm.addControl(entry.id.toString(), new FormControl(''));
          }); 
        }
        else { console.log("no guided journals") }
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
            let currentControl = this.guidedJournalForm.get(journalLogs[i].entryId.toString());
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
            console.log("in wellness rating - date is not current date")
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
        //save logs for later http call
        this.entryDateHabitLogs = logs;

        if (logs.length !== 0) {

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
   
   if(formType === 'journal'){
    this.modalJournalEntries = this.journalEntries.slice(); 
    this.modalJournalEntries.forEach(entry =>{
   (<FormArray>this.modalForm.get('items')).push(new FormControl(entry.entryName))
    })
    
   }

  
  this.modalService.open(content, { size: 'md' });
 
 
  }
  closePopup() {
    this.displayStyle = "none";
  }
  deleteItem(index:number){
   if(this.formType === 'journal'){
    let formArray = this.modalForm.get('items') as FormArray; 
    this.deletedJournalEntries.push(this.modalJournalEntries[index]); 
    this.modalJournalEntries.splice(index, 1);
    formArray.removeAt(index);
    //have a deletedItemsArray to remove the items from the db on update 
   }
  
  }
  editItem(index:number, item:string){
    console.log("edit called", index, item)
    if(this.formType === 'journal'){
      this.modalJournalEntries[index].entryName = item ;
      
    }
    else {
      this.modalHabits[index].habitName = item; 
    }
  }
  
  update(){
  this.journalEntries = this.modalJournalEntries.slice(); 
  console.log("journalentries", this.journalEntries)
  }
  addItem(){
   
      if(this.formType === 'journal'){
        let newItem = this.modalForm.get('addItemInput')?.value ;
        this.modalForm.get('addItemInput')?.setValue(''); 
        console.log('new item ', newItem)
        let newEntry:IGuidedJournalEntry = {
          id: 0, 
          userId:this.currentUserId, 
          entryName:newItem ?? '' , 
          deleted:false
        }
        console.log('newEntry' , newEntry);
       // this.modalForm.addControl('' , new FormControl(newEntry.entryName));
       (<FormArray>this.modalForm.get('items')).push(new FormControl(newItem))
       this.modalJournalEntries.push(newEntry); 
      }
     
  }

  

}

