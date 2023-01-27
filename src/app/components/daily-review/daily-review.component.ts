import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';
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

 


  ngOnInit(): void {
    

    this.dailyReviewForm = this.fb.group({

    })
  }

  submit(){
    console.log("review submit called");
  }

setRating(event:any){
this.sleepRating = event.target.value; 
console.log("sleep rating", this.sleepRating);
}

}
