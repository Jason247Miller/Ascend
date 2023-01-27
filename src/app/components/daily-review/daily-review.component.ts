import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { wellnessRating } from 'src/app/models/WellnessRating';
/*
pull wellnessRatings 
pull HabitRatings
pull textFields (for journal entry, anything stand out, etc.)
1. create wellnessRatings, HabitRatings, textDescription interfaces
2. import then in the component and initialize the data
3. display ratings using ngFor and within their own container
4. display textDescription properties 
5. 
*/

@Component({
  selector: 'app-daily-review',
  templateUrl: './daily-review.component.html',
  styleUrls: ['./daily-review.component.less']
})
export class DailyReviewComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService){}

    dailyReviewForm!: FormGroup; 
    sleepRating:number = 5; 
    excerciseRating:number = 5; 
    nutritionRating:number = 5; 
    stressRating:number = 5; 
    wellnessRatings!:wellnessRating[]; 
    currentDate:string; 
     

  ngOnInit(): void {
  
  let date = new Date(); 
  let day = date.getDate();
  let month = date.getMonth() + 1 ;
  let year = date.getFullYear();
  this.currentDate = `${day}-${month}-${year}`; 
  let test = this.accountService.entryExistsForCurrentDate(this.currentDate); 
  console.log(this.currentDate);

  
    this.dailyReviewForm = this.fb.group({

    })
  }

  submit(){
    console.log("review submit called");

    //check if there is a review for the current date already 

  }

setRating(event:any){

  if(event.target){
  if(event.target.id === 'sleepQuality'){
  this.sleepRating = event.target.value;
  console.log("sleep score", this.sleepRating);
  }
  else if(event.target.id === 'exercise'){
  this.excerciseRating = event.target.value; 
  console.log("excercise score", this.excerciseRating);
  }
  else if(event.target.id === 'nutrition'){
  this.nutritionRating = event.target.value; 
  console.log("nutrition score", this.nutritionRating);
  }
  else if(event.target.id === 'stress'){
    this.stressRating = event.target.value; 
  }
}



}

}
