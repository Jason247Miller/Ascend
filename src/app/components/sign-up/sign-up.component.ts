import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, EMPTY, first, take } from 'rxjs';
import { MustMatch } from '../../helpers/mustmatch';
import { AccountService } from 'src/app/services/account/account.service';
import { User } from '../../models/Users';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({selector: "app-sign-up",
    templateUrl: "./sign-up.component.html",
    styleUrls: ["./sign-up.component.less"]})
export class SignUpComponent implements OnInit {

    constructor(
private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private alertService: AlertService){}

  signUpForm!: FormGroup;
  dataToSend!:User; 
  errorMessage:string; 
 
    ngOnInit(): void {
    
        this.signUpForm = this.fb.group(
            {firstName: ["", Validators.required],
                lastName: ["", Validators.required],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required,
                    Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")]],
                confirmPassword: ["", [Validators.required, 
                    Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")]]},
            {validator:MustMatch(
                    "password",
                    "confirmPassword"
                )}
        );
    }
    submit() {

        const formData = this.signUpForm.getRawValue();
        this.dataToSend = {id:0, //default
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email, 
            password: formData.password};

        this.accountService.signUp(this.dataToSend).
            pipe(
                take(1)
            ). 
            subscribe(() => {
                this.handleSignUpSuccess(); 
            });
    }

    //form access getters
    get firstName() {
        return this.signUpForm.get("firstName"); 
    }
    get lastName() {
        return this.signUpForm.get("lastName"); 
    }
    get email() {
        return this.signUpForm.get("email"); 
    }
    get password() {
        return this.signUpForm.get("password"); 
    }
    get confirmPassword() {
        return this.signUpForm.get("confirmPassword"); 
    }

    handleSignUpSuccess() {
        
        this.router.navigate(["./login"]);
    }

}

