import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account/account.service';
import { WellnessRating } from 'src/app/models/wellness-rating';
import { take } from 'rxjs';


@Component({
  selector: 'app-daily-review',
  templateUrl: './daily-review.component.html',
  styleUrls: ['./daily-review.component.less']
})
export class DailyReviewComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private accountService: AccountService){
      this.dailyReviewForm = this.fb.group({
        sleepRating:[5, Validators.required],
        exerciseRating:[5, Validators.required],
        nutritionRating:[5, Validators.required],
        stressRating:[5, Validators.required],
        sunlightRating:[5, Validators.required],
        mindfulnessRating:[5, Validators.required],
        productivityRating:[5, Validators.required],
        moodRating:[5, Validators.required],
        energyRating:[5, Validators.required],
    
      }); 
    }


    private currentDateEntry: WellnessRating[]; 
    private  wellnessRatingGroup:FormGroup; 
    dailyReviewForm!: FormGroup; 
    currentDate:string; 
   
     

  ngOnInit(): void{
 
  this.setCurrentDate(); 
  console.log("ngOnit Daily Review")
  
  console.log("ngOnit Daily Review=", this.dailyReviewForm);
  this.accountService.entryExistsForCurrentDate(this.currentDate)
  .pipe(take(1)).subscribe(
    
       entry => { 
      this.currentDateEntry = entry
      if(this.currentDateEntry){
        console.log("entry already exists, would you like to edit todays entry?")
      }
      else{
        console.log("currentdate entry does not exist") 
      }
  
      });
   
   
 
  }

  submit(){
    console.log("review submit called");

    //check if there is a review for the current date already 

  }

setRating(event:any){

}

setCurrentDate(): void {
  let date = new Date(); 
  let day = date.getDate();
  let month = date.getMonth() + 1 ;
  let year = date.getFullYear();
  this.currentDate = `${day}-${month}-${year}`; 
}

}


