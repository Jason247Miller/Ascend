import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, first, take } from 'rxjs';
import { Alert } from 'src/app/models/alert';
import { User } from 'src/app/models/Users';
import { AccountService } from 'src/app/services/account/account.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

    constructor(
private fb : FormBuilder,
             private accountService: AccountService,
             private router: Router,
             private alertService: AlertService
    ) {}
    loginForm!: FormGroup;
    errorMessage?:string;
    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    //getters for form access 
    get password() {
        return this.loginForm.get('password'); 
    }
    get email() {
        return this.loginForm.get('email'); 
    }

    submit() {
    //return if form is not valid
        if(this.loginForm.invalid)return;
   
        this.accountService.login(
            this.email?.value,
            this.password?.value
        ).
            pipe(
                take(1), 
                catchError(error => this.handleError(error))
            ). 
            subscribe(user => this.handleLogin(user));
    }

    handleError(error:string) {
        this.errorMessage = JSON.stringify(error); 
        console.error("error logging in " + this.errorMessage); 
        this.alertService.error(
            'User name or password is incorrect!',
            {autoClose:false}
        );
        return EMPTY; 
    }
    handleLogin(user:User) {
        if(this.accountService.redirectUrl) {
            this.router.navigateByUrl(this.accountService.redirectUrl);
        } else{
            this.router.navigateByUrl('/dashboard'); 
        }
    
        this.accountService.setLocalStoreageUserSubject(user);
        console.log("Successfully logged in user:" + user.firstName);
    }
     
}
