import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';

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

  ngOnInit(): void {
    this.dailyReviewForm = this.fb.group({

    })
  }

  submit(){
    console.log("review submit called");
  }

}
