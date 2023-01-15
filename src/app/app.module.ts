import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import {ReactiveFormsModule} from '@angular/forms'
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignUpComponent,
    KnowledgeBaseComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
     //moved all the routes here and deleted the unneeded modules 
      {path: 'kb', component:KnowledgeBaseComponent},
      {path: 'login', component:LoginComponent},
      {path: 'sign-up', component:SignUpComponent},
      {path: 'Home', component:HomeComponent},
      {path: '', redirectTo: 'Home', pathMatch: 'full'},
      {path: '**', redirectTo: 'Home', pathMatch: 'full'},

    ])
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
