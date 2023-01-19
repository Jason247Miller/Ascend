import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { User } from './Users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   loggedInUser:any; 
  constructor(private accountService: AccountService){}
  ngOnInit(): void {
    this.accountService.currentUserSubject.subscribe(
      user => {
        if(user === null){ this.loggedInUser = null; }
        else{ this.loggedInUser = user}
        console.log("user=", JSON.stringify(this.loggedInUser))
      }
    )
  }
  
  title = 'Ascend';
  
}
