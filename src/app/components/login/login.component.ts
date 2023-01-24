import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, first } from 'rxjs';
import { Alert } from 'src/app/models/alert';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

 constructor(private fb : FormBuilder,
             private accountService: AccountService,
             private router: Router,
             private alertService: AlertService){}
 loginForm!: FormGroup;
 errorMessage?:string;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
   })
  }
  //getters for form access 
  get password(){return this.loginForm.get('password'); }
  get email(){ return this.loginForm.get('email'); }

  submit(){
    //return if form is not valid
    if(this.loginForm.invalid){return;}
   
    this.accountService.login(this.email?.value, this.password?.value)  
   .pipe(first()).subscribe({
      next: user => {
        //on success just navigate to the home page
        if(this.accountService.redirectUrl){
          this.router.navigateByUrl(this.accountService.redirectUrl);
        }
        else{this.router.navigateByUrl('/dashboard');}
        
        this.accountService.getCurrentUserSubject().next(user)
        //this.alertService.success("Successfully logged in user:" + user.firstName);
        console.log("Successfully logged in user:" + user.firstName);
      },
      error: error =>{
        
        this.errorMessage = error.body.error; 
        this.alertService.error(JSON.stringify(this.errorMessage), {autoClose:false} )
     
      }
    }
    )
  }
     
}
