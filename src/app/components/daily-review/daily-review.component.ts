import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { wellnessRating } from 'src/app/models/WellnessRating';
import { take } from 'rxjs';
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


    private currentDateEntry: wellnessRating[]; 
    private  wellnessRatingGroup:FormGroup; 
    dailyReviewForm!: FormGroup; 
   // sleepRating:number = 5; 
   // excerciseRating:number = 5; 
   // nutritionRating:number = 5; 
    //stressRating:number = 5; 
    currentDate:string; 
   
     

  ngOnInit(): void
   {
 

  
  this.setCurrentDate(); 

   this.dailyReviewForm = this.fb.group({
    sleepRating:[5],
    exerciseRating:[5, Validators.required],
    nutritionRating:[5, Validators.required],
    stressRating:[5, Validators.required],
    sunlightRating:[5, Validators.required],
    mindfulnessRating:[5, Validators.required],
    productivityRating:[5, Validators.required],
    moodRating:[5, Validators.required],
    energyRating:[5, Validators.required],

  }); 



  this.accountService.entryExistsForCurrentDate(this.currentDate)
  .pipe(take(1)).subscribe({
     next: entry => { 
      this.currentDateEntry = entry
    }, 
  //  complete:
    });
   
    if(this.currentDateEntry){
      console.log("entry already exists, would you like to edit todays entry?")
    }
    else{
      console.log("currentdate entry does not exist") 
      this.dailyReviewForm = this.fb.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required]
      })

    }

 
  }

  submit(){
    console.log("review submit called");

    //check if there is a review for the current date already 

  }

setRating(event:any){

  /*if(event.target){
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
  */
//}
}

setCurrentDate(): void {
  let date = new Date(); 
  let day = date.getDate();
  let month = date.getMonth() + 1 ;
  let year = date.getFullYear();
  this.currentDate = `${day}-${month}-${year}`; 
}

}


