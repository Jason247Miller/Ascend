import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';
declare var window:any; 

@Component({
  selector: 'app-guided-journal-form',
  templateUrl: './guided-journal-form.component.html',
  styleUrls: ['./guided-journal-form.component.less']
})
export class GuidedJournalFormComponent implements OnInit {


ngOnInit(): void {
  this.formModal = new window.bootstrap.Modal(
    document.getElementById('actionsModal')
  )
   
 
}
@Input() guidedJournalForm:FormGroup; 
@Input() previousDailyReview:boolean; 
@Input() journalEntries:IGuidedJournalEntry[]; 
@Input() formModal:any; 


openModal(){
  this.formModal.show(); 
}
doSomething(){
  this.formModal.hide(); 
}
}
