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
    }

    private currentDateWellnessEntry: WellnessRating; 
    private dataToSend: WellnessRating; 
    private currentUserId: number;
    private wellnessRecordId: number; 
    wellnessRatingForm!: FormGroup; 
    habitReviewForm!: FormGroup; 
    currentDate:string; 
    localStoreUserObj!:string;
    
  ngOnInit(): void{
  
   this.currentUserId =  JSON.parse(localStorage.getItem('currentUser') || '{}').id; 
   console.log("currentUserId=", this.currentUserId);


  this.wellnessRatingForm = this.fb.group({
        sleepRating:[ Validators.required],
        exerciseRating:[Validators.required],
        nutritionRating:[ Validators.required],
        stressRating:[ Validators.required],
        sunlightRating:[Validators.required],
        mindfulnessRating:[ Validators.required],
        productivityRating:[Validators.required],
        moodRating:[Validators.required],
        energyRating:[ Validators.required],
        userId:this.currentUserId
      }); 

      this.habitReviewForm = this.fb.group({
        sleepRating:[5, Validators.required],
        exerciseRating:[5, Validators.required],
        nutritionRating:[5, Validators.required],
        stressRating:[5, Validators.required],
        sunlightRating:[5, Validators.required],
        mindfulnessRating:[5, Validators.required],
        productivityRating:[5, Validators.required],
        moodRating:[5, Validators.required],
        energyRating:[5, Validators.required],
        userId: this.currentUserId
      }); 

  this.setCurrentDate(); 
 
  this.accountService.entryExistsForCurrentDate(this.currentDate)
  .pipe(take(1)).subscribe(
    
       entry => { 
      this.currentDateWellnessEntry = entry[0];

      //entry exists for current date 
      if(entry.length !== 0){

        this.wellnessRecordId = this.currentDateWellnessEntry.id; 
        console.log('entry returned', this.currentDateWellnessEntry);
        console.log("entry already exists, would you like to edit todays entry?");
        
        //show the form with the already inputted values
        this.wellnessRatingForm.patchValue(
         this.currentDateWellnessEntry

        );

           
      }
      else{
        console.log("currentdate entry does not exist") 
      }
  
      });
   
  }

  submit(){
    console.log("review submit called");
    //if using existing entry, send the form data along with the wellnessId and HabbitId
    // Update the values in the account service function 
    const formData = this.wellnessRatingForm.getRawValue();
        this.dataToSend = {
            id: this.wellnessRecordId,
            userID: formData.userId,
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

        this.accountService.updateWellnessData(this.dataToSend)
        .pipe(
                take(1)   
            ). 
            subscribe(() => {
               //give message of success, redirect to dashboard main page
              console.log("form update success")
            });
        
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
get sleepRating() {
  return this.wellnessRatingForm.get("sleepRating"); 
}

}


