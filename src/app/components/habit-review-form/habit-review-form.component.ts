import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Habit } from 'src/app/models/Habit';

@Component({
  selector: 'app-habit-review-form',
  templateUrl: './habit-review-form.component.html',
  styleUrls: ['./habit-review-form.component.less']
})
export class HabitReviewFormComponent {

@Input() habitReviewForm:FormGroup; 
@Input() noHabits:boolean; 
@Input() habits: Habit[] = [];

}
