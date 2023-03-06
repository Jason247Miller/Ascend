import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/fake server/in-memory-data.service';
import { AccountService } from './services/account/account.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
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

@NgModule(
      {declarations: [
                  AppComponent,
                  LoginComponent,
                  HomeComponent,
                  SignUpComponent,
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
                        InMemoryDataService, {dataEncapsulation: false}

                  ),

                  RouterModule.forRoot([
                        {path: 'kb', component: KnowledgeBaseComponent},
                        {path: 'login', component: LoginComponent},
                        {path: 'sign-up', component: SignUpComponent},
                        {path: 'Home', component: HomeComponent},
                        {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent,
                              children: [
                                    {path: '', redirectTo: 'overview', pathMatch: 'full'},
                                    {path: 'overview', component: OverviewComponent},
                                    {path: 'daily-review', component: DailyReviewComponent},
                                    {path: 'daily-review/:date', component: DailyReviewComponent},
                                    {path: 'reports', component: ReportsComponent},
                                    {path: 'goals', component: GoalsComponent}
                              ]},
                        {path: '', redirectTo: 'Home', pathMatch: 'full'},
                        {path: '**', redirectTo: 'Home', pathMatch: 'full'},


                  ]),
                  NoopAnimationsModule,
                  NgbModule
            ],
            providers: [AccountService],
            bootstrap: [AppComponent]})
export class AppModule { }
