import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subject, take, tap } from 'rxjs';
import { AccountService } from './services/account.service';
import { User } from './Users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
   currentUser$!:BehaviorSubject<User | string>; 
   localStorageUser$!: BehaviorSubject<any>;
   title = 'Ascend';
  constructor(private accountService: AccountService){}

  ngOnInit(): void {
  
    this.localStorageUser$ = this.accountService.getlocalStorageUserSubject();
    //emit the user in local storage if there is one, otherwise default value
    if(localStorage.getItem('currentUser')){
      this.localStorageUser$.next(localStorage.getItem('currentUser'))
    }
    console.log("local storeage user = ", localStorage.getItem('currentUser'))
  }

  logOut():void{this.accountService.logOut();}

}
