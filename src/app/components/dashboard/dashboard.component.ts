import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

@Component({selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private accountService: AccountService){}
  private sidebarSub:Subscription; 
  sidebarDisplayProp:string;  
  hideSidebar: boolean = true;

  ngOnInit(): void {
   this.sidebarSub =  this.accountService.hideSideBar$.subscribe(hideSidebar => {
      this.hideSidebar = hideSidebar; 
    
    });
  }
  ngOnDestroy(): void {
   this.sidebarSub.unsubscribe(); 
  }

}
