
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, Subscription, take, takeUntil } from 'rxjs';
import { AccountService } from './services/account/account.service';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, InteractionStatus, RedirectRequest } from '@azure/msal-browser';

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
    loginDisplay = false;
    hideSidebar: boolean;

    constructor(
        private accountService: AccountService,
        private router: Router,
        private authService: MsalService,
        private broadcastService: MsalBroadcastService,
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
        ) {}

    ngOnInit(): void {

        this.broadcastService.msalSubject$
            .subscribe((event: EventMessage) => {

                if (event.eventType === 'msal:loginSuccess') {

                    this.router.navigate(['dashboard/overview']);
                }
                if (event.eventType === 'msal:logoutSuccess') {

                    this.router.navigate(['Home/']);
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

        this.hideSidebar = false;

    }

    login() {

        if (this.msalGuardConfig.authRequest) {
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

    sideBarDisplay() {

        this.accountService.hideSideBar$
            .pipe(take(1))
            .subscribe(value => {
                this.hideSidebar = value;
            });

        this.accountService.setSidebarValue(!this.hideSidebar);
    }

    ngOnDestroy(): void {

        //unsubscribe from broadcast service 
        this._destroying$.next(undefined);
        this._destroying$.complete();

        this.msalBroadcastSub.unsubscribe();
    }

}
