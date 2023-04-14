import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/fake server/in-memory-data.service';
import { AccountService } from './services/account/account.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AlertComponent } from './components/alert/alert.component';
import { DailyReviewComponent } from './components/daily-review/daily-review.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ReportsComponent } from './components/reports/reports.component';
import { HabitReviewFormComponent } from './components/habit-review-form/habit-review-form.component';
import { WellnessRatingFormComponent } from './components/wellness-rating-form/wellness-rating-form.component';
import { GuidedJournalFormComponent } from './components/guided-journal-form/guided-journal-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoalsComponent } from './components/goals/goals.component';
import { MsalGuard, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';


//redirects a user to login page when trying to access a protected route
const msalGuardConfig: MsalGuardConfiguration = {
      interactionType: InteractionType.Redirect,
      authRequest: {
            scopes: ['openid', 'profile', 'user.read']
      }
};
//intercepts http requests and attaches tokens to the auth header
const msalInterceptorConfig: MsalInterceptorConfiguration = {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map([
            ['https://graph.microsoft.com/v1.0/', ['user.read']]
      ])
};

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
@NgModule(
      {
            declarations: [
                  AppComponent,
                  HomeComponent,
                  KnowledgeBaseComponent,
                  DashboardComponent,
                  AlertComponent,
                  DailyReviewComponent,
                  OverviewComponent,
                  ReportsComponent,
                  HabitReviewFormComponent,
                  WellnessRatingFormComponent,
                  GuidedJournalFormComponent,
                  GoalsComponent
            ],
            imports: [

                  BrowserModule,
                  ReactiveFormsModule,
                  HttpClientModule,
                  HttpClientInMemoryWebApiModule.forRoot(
                        InMemoryDataService, { dataEncapsulation: false }
                  ),
                  MsalModule.forRoot(new PublicClientApplication({
                        auth: {
                              clientId: '508a9ea9-9d32-4437-9e24-36cc62dccc63', // Application (client) ID from the app registration
                              authority: 'https://login.microsoftonline.com/07fcd2cd-de40-4214-bf28-7818722bd2d8', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
                              redirectUri: 'http://localhost:4200'// This is your redirect URI
                        },
                        cache: {
                              cacheLocation: 'localStorage',
                              storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
                        }
                  }), msalGuardConfig, msalInterceptorConfig),
                  RouterModule.forRoot([
                        { path: 'kb', component: KnowledgeBaseComponent },
                        { path: 'Home', component: HomeComponent },
                        {
                              path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard],
                              children: [
                                    { path: '', redirectTo: 'overview', pathMatch: 'full' },
                                    { path: 'overview', component: OverviewComponent },
                                    { path: 'daily-review', component: DailyReviewComponent },
                                    { path: 'daily-review/:date', component: DailyReviewComponent },
                                    { path: 'reports', component: ReportsComponent },
                                    { path: 'goals', component: GoalsComponent }
                              ]
                        },
                        { path: '', redirectTo: 'Home', pathMatch: 'full' },
                        { path: '**', redirectTo: 'Home', pathMatch: 'full' }
                  ]),
                  NoopAnimationsModule,
                  NgbModule
            ],
            providers: [
                  AccountService,
                  MsalGuard
            ],
            bootstrap: [AppComponent, MsalRedirectComponent]
      })
export class AppModule { }