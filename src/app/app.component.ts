import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { AccountService } from './services/account.service';
import { User } from './Users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   currentUser$!:BehaviorSubject<User | string>; 
   title = 'Ascend';
   item: any
  constructor(private accountService: AccountService){}

  ngOnInit(): void {
    //obtain changes in currentUser$ Behavior Subject to update component view
    this.currentUser$ = this.accountService.getCurrentUserSubject();
    
  }

  logOut():void{this.accountService.logOut();}
  

  
}
