import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from './services/account/account.service';
import { User } from './models/Users';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    localStorageUser$:Observable<User|string|null> =  this.accountService.getLocalStoreageUser$(); 
    title = 'Ascend';
    constructor(private accountService: AccountService) {}

    ngOnInit(): void {
  
       
        //emit the user in lo$cal storage if there is one, otherwise default value
        if(localStorage.getItem('currentUser')) {
            console.log("inside localStoreage if");
            this.accountService.setLocalStoreageUserSubject(localStorage.getItem('currentUser'));
             
        }
        else{
            this.accountService.setLocalStoreageUserSubject('default');
        }
    }

    logOut():void {
        this.accountService.logOut(); 
    }

}
