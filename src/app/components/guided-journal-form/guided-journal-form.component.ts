import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guided-journal-form',
  templateUrl: './guided-journal-form.component.html',
  styleUrls: ['./guided-journal-form.component.less']
})
export class GuidedJournalFormComponent {
@Input() guidedJournalForm:FormGroup; 
@Input() previousDailyReview:boolean; 
}