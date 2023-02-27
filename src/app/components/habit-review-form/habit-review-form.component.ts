import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Habit } from 'src/app/models/Habit';

@Component({selector: 'app-habit-review-form',
  templateUrl: './habit-review-form.component.html',
  styleUrls: ['./habit-review-form.component.less']})
export class HabitReviewFormComponent  {

@Input() habitReviewForm:FormGroup; 
@Input() habits: Habit[] = [];
@Input() previousDailyReview:boolean; 
@Output() actionsClicked =   new EventEmitter<string>();

actionsClickedHandler(){
this.actionsClicked.next('habits'); 
}

}
