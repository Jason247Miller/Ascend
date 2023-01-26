import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; 
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { ReactiveFormsModule} from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/fake server/in-memory-data.service';
import { AccountService } from './services/account/account.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AlertComponent } from './components/alert/alert.component';
import { DailyReviewComponent } from './components/daily-review/daily-review.component';
import { OverviewComponent } from './components/overview/overview.component';

@NgModule(
  {
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    KnowledgeBaseComponent,
    DashboardComponent,
    AlertComponent,
    DailyReviewComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
    InMemoryDataService, { dataEncapsulation: false }
    
    ),

    
    
    RouterModule.forRoot([
      {path: 'kb', component:KnowledgeBaseComponent},
      {path: 'login', component:LoginComponent},
      {path: 'sign-up', component:SignUpComponent},
      {path: 'Home', component:HomeComponent},
      {path: 'dashboard', canActivate:[AuthGuard], component:DashboardComponent,
       children:  [
        {path: '', redirectTo: 'overview', pathMatch:'full'},
        {path: 'overview', component: OverviewComponent},
        {path: 'daily-review', component: DailyReviewComponent }
       ]},
      {path: '', redirectTo: 'Home', pathMatch: 'full'},
      {path: '**', redirectTo: 'Home', pathMatch: 'full'},

    ])
  ],
  providers:[ AccountService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
