import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({selector: 'app-wellness-rating-form',
  templateUrl: './wellness-rating-form.component.html',
  styleUrls: ['./wellness-rating-form.component.less']})
export class WellnessRatingFormComponent {
@Input() wellnessRatingForm: FormGroup; 
@Input() previousDailyReview:boolean; 

//wellness form getters for template access 
get exerciseRating() {
  return this.wellnessRatingForm.get('exerciseRating')?.value
}
get sunlightRating() {
  return this.wellnessRatingForm.get("sunlightRating")?.value;
}
get sleepRating() {
  return this.wellnessRatingForm.get("sleepRating")?.value;
}
get nutritionRating() {
  return this.wellnessRatingForm.get("nutritionRating")?.value;
}
get stressRating() {
  return this.wellnessRatingForm.get("stressRating")?.value;
}
get mindfulnessRating() {
  return this.wellnessRatingForm.get("mindfulnessRating")?.value;
}
get productivityRating() {
  return this.wellnessRatingForm.get("productivityRating")?.value;
}
get moodRating() {
  return this.wellnessRatingForm.get("moodRating")?.value;
}
get energyRating() {
  return this.wellnessRatingForm.get("energyRating")?.value;
}
get overallDayRating() {
  return this.wellnessRatingForm.get("overallDayRating")?.value;
}

}
