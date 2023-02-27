
import { Component, OnInit } from '@angular/core';
import {  Observable, take } from 'rxjs';
import { AccountService } from './services/account/account.service';
import { User } from './models/Users';
import { ActivatedRoute } from '@angular/router';

@Component({selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']})
export class AppComponent implements OnInit {
    localStorageUser$:Observable<User|string|null> =  this.accountService.getLocalStoreageUser$(); 
    title = 'Ascend';
    hideSidebar:boolean; 
    currentRoute:string; 
    constructor(private accountService: AccountService, private route:ActivatedRoute) {}
    ngOnInit(): void {
        
        this.route.url
        .pipe(take(1))
        .subscribe(url => {
            this.currentRoute = url.join('');
          });
        
       this.hideSidebar = false; 
        
        if(localStorage.getItem('currentUser')) {

            this.accountService.setLocalStoreageUserSubject(localStorage.getItem('currentUser'));
             
        }
        else{
            this.accountService.setLocalStoreageUserSubject('default');
        }
    }

    logOut():void {
        this.accountService.logOut(); 
    }
   
    sideBarMenuDisplay(){
      
       this.accountService.hideSideBar$.pipe(take(1)).subscribe(value =>{
        this.hideSidebar = value; 
       })
       this.accountService.setSidebarValue(!this.hideSidebar);
    }

}
