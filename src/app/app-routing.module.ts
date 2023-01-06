import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';

const routes: Routes = [

{path: 'Home', component:HomeComponent},
{path: '', redirectTo: 'Home', pathMatch: 'full'},
{path: '**', redirectTo: 'Home', pathMatch: 'full'},

];

@NgModule({
  
  imports: [RouterModule.forRoot(
    routes),
  //seperated the component routes into their own modules
   LoginModule,
   SignUpModule,
   KnowledgeBaseModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
