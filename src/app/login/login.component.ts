import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

 constructor(private fb : FormBuilder,
             private accountService: AccountService,
             private router: Router){}
 loginForm!: FormGroup;
 errorMessage?:string;
 @Output() loginEvent = new EventEmitter<boolean>;  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
   })
  }

  get password(){return this.loginForm.get('password'); }
  get email(){ return this.loginForm.get('email'); }

  submit(){
    //return if form is not valid
    if(this.loginForm.invalid){return;}
   
    this.accountService.login(this.email?.value, this.password?.value)  
   .subscribe({
      next: user => {
        //on success just navigate to the home page
        //this.router.navigateByUrl(returnUrl);
        this.accountService.currentUserSubject.next(user)
        console.log("Successfully logged in user:" + user.firstName)
      },
      error: error =>{
        //add error message to alert service
        this.errorMessage = error; 
        console.error(`error logging in user:   ${error} `);
      }
    }
    )
  }
     
}
