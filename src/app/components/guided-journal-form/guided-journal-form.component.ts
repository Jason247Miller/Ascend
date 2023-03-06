import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';

@Component({selector: 'app-guided-journal-form',
  templateUrl: './guided-journal-form.component.html',
  styleUrls: ['./guided-journal-form.component.less']})
export class GuidedJournalFormComponent  {

@Input() guidedJournalForm:FormGroup; 
@Input() previousDailyReview:boolean; 
@Input() journalEntries:IGuidedJournalEntry[]; 
@Input() formModal:any; 
@Output() actionsClicked =   new EventEmitter<string>();

actionsClickedHandler(){
this.actionsClicked.next('journal'); 
}

}
