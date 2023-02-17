import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';


@Component({
  selector: 'app-guided-journal-form',
  templateUrl: './guided-journal-form.component.html',
  styleUrls: ['./guided-journal-form.component.less']
})
export class GuidedJournalFormComponent implements OnInit {


ngOnInit(): void {

   
 
}
@Input() guidedJournalForm:FormGroup; 
@Input() previousDailyReview:boolean; 
@Input() journalEntries:IGuidedJournalEntry[]; 
}
