
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { filter, Observable, Subject, Subscription, take, takeUntil } from 'rxjs';
import { AccountService } from './services/account/account.service';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, InteractionStatus, InteractionType, RedirectRequest } from '@azure/msal-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

    private readonly _destroying$ = new Subject<void>();
    private msalBroadcastSub: Subscription; 
    userOid = this.accountService.getUserOid();
    title = 'Ascend';
    isIframe = false;
    loginDisplay = false;
    hideSidebar: boolean;
    currentRoute: string;

    constructor(private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: MsalService,
        private broadcastService: MsalBroadcastService,
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration) { }
    ngOnInit(): void {

        this.isIframe = window !== window.parent && !window.opener;
       this.broadcastService.msalSubject$
      .subscribe((event: EventMessage) => {
        if (event.eventType === 'msal:loginSuccess' ) {
          console.log("log in successful");
          this.router.navigate(['dashboard/overview']);
        }
    });

        this.broadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this._destroying$)
            )
            .subscribe(() => {
                this.setLoginDisplay();
            });

        this.route.url
            .pipe(take(1))
            .subscribe(url => {
                this.currentRoute = url.join('');
            });

        this.hideSidebar = false;

    }
    login() {
        if (this.msalGuardConfig.authRequest) {
            console.log("redirect request");
            this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
        }
        else {          
            this.authService.loginRedirect();
        }


    }
    setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    }
    logOut(): void {
        this.authService.logoutRedirect({
            postLogoutRedirectUri: 'http://localhost:4200'
        });
    }

    sideBarMenuDisplay() {

        this.accountService.hideSideBar$.pipe(take(1)).subscribe(value => {
            this.hideSidebar = value;
        })
        this.accountService.setSidebarValue(!this.hideSidebar);
    }

    ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();

        if(this.msalBroadcastSub){
            this.msalBroadcastSub.unsubscribe();
        }
    }

}
