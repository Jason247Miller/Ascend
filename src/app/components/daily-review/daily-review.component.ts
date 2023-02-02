import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Habit } from 'src/app/models/Habit';
@Component({
  selector: 'app-daily-review',
  templateUrl: './daily-review.component.html',
  styleUrls: ['./daily-review.component.less']
})
export class DailyReviewComponent implements OnInit {
 

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService){
    }

    private currentDateWellnessEntry: IWellnessRating; 
    private currentUserId: number;
    private wellnessRecordId: number; 
    private newEntry:boolean; 
    private dataToSend!: IWellnessRating; 
    currentUserHabits:string[] = []; 
     
    
    wellnessRatingForm!: FormGroup; 
    habitReviewForm!: FormGroup; 
    currentDate:string; 
  
    
  ngOnInit(): void{
    
   console.log('ngOnit');
   this.currentUserId =  JSON.parse(localStorage.getItem('currentUser') || '{}').id; 
   this.setCurrentDate(); 
   this.initializeForms(); 

  
  this.accountService.entryExistsForCurrentDate(this.currentDate, this.currentUserId)
  .pipe(take(1)).subscribe(
    
       entry => { 
      this.currentDateWellnessEntry = entry[0];

      //entry exists for current date, pull existing values
      if(entry.length !== 0){
        this.newEntry = false; 
        this.wellnessRecordId = this.currentDateWellnessEntry.id; 
        console.log("entry already exist");
        this.wellnessRatingForm.patchValue(this.currentDateWellnessEntry); 
      }
      else{ 
        this.newEntry = true; 
        console.log("currentdate entry does not exist"); 
      }
      });
   
  }//end ngOnit

  submit(){
    console.log("review submit called");

    const formData = this.wellnessRatingForm.getRawValue();
        
        this.dataToSend = {
            id: 0,
            userId: formData.userId,
            date: formData.date, 
            sleepRating: formData.sleepRating,
            exerciseRating:formData.exerciseRating, 
            nutritionRating:formData.nutritionRating,
            stressRating:formData.stressRating, 
            sunlightRating:formData.sunlightRating, 
            mindfulnessRating:formData.mindfulnessRating, 
            productivityRating:formData.productivityRating, 
            moodRating:formData.moodRating, 
            energyRating:formData.energyRating
        };

       //if not a new entry
       if(this.newEntry === true){

        this.newEntry = false; 
        
        this.accountService.addWellnessRatingEntry(this.dataToSend)
        .subscribe(()=>{
          this.alertService.success('Wellness Rating has been submitted successfully');
         }
        );
       }
       else if(this.newEntry === false){
        console.log("new entry false");

        this.accountService.entryExistsForCurrentDate(this.currentDate, this.currentUserId)
        .pipe(take(1))
        .subscribe(
          entry => {
          
          if(entry.length !== 0){

            this.wellnessRecordId = entry[0].id

        this.dataToSend.id = this.wellnessRecordId; 
        console.log('wellness id', this.wellnessRecordId)

        this.accountService.updateWellnessData(this.dataToSend)
        .pipe(take(1))
        .subscribe(() => {
             console.log("form update success");
             this.alertService.success('Wellness Entry Successfully Updated', {autoClose:false});
            });
        
        }
      }
    );

  }
}

setCurrentDate(): void {
  let date = new Date(); 
  let day = date.getDate();
  let month = date.getMonth() + 1 ;
  let year = date.getFullYear();
  this.currentDate = `${day}-${month}-${year}`; 
}


initializeForms(){

  this.habitReviewForm = this.fb.group({});
  this.accountService.getHabitsForCurrentUser(this.currentUserId)
  .pipe(take(1))
  .subscribe(  habits => {

      habits.forEach(habit => {
      console.log("habitname", habit.habitName);
      console.log("currentUserhabits", this.currentUserHabits)
      this.currentUserHabits.push(habit.habitName); 
      this.habitReviewForm.addControl(habit.habitName, new FormControl(false)); 
    })
    

 })


 //this.habitReviewForm.addControl('ride bike', false);

 //call method to get habits for current user (name and description only) as form array
 // this.formArrayDefined.push(this.fb.control(''))

  this.wellnessRatingForm = this.fb.group({
    sleepRating:[0, Validators.required],
    exerciseRating:[0,Validators.required],
    nutritionRating:[0, Validators.required],
    stressRating:[0, Validators.required],
    sunlightRating:[0,Validators.required],
    mindfulnessRating:[0, Validators.required],
    productivityRating:[0,Validators.required],
    moodRating:[0,Validators.required],
    energyRating:[0, Validators.required],
    userId:this.currentUserId,
    date:this.currentDate
  }); 
  
 


}


}


