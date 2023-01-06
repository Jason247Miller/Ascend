import { NgModule } from "@angular/core";
import { SignUpComponent } from "./sign-up.component";
import { RouterModule } from "@angular/router";

@NgModule({
declarations:[
 
],
imports:[
RouterModule.forChild([
    {path: 'sign-up', component:SignUpComponent}
])
]
})
export class SignUpModule {}