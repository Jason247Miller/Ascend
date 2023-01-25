import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, EMPTY, first } from "rxjs";
import { MustMatch } from "../helpers/mustmatch";
import { AccountService } from "../services/account.service";
import { User } from "../Users";


@Component({
    selector: "app-sign-up",
    templateUrl: "./sign-up.component.html",
    styleUrls: ["./sign-up.component.less"]
})
export class SignUpComponent implements OnInit {

    constructor(
private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router
    ) {}

    signUpForm!: FormGroup;
    dataToSend!:User; 
 
    ngOnInit(): void {
    
        this.signUpForm = this.fb.group(
            {
                firstName: ["", Validators.required],
                lastName: ["", Validators.required],
                email: ["", [Validators.required, Validators.email]],
                password: ["", [Validators.required,
                    Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")]],
                confirmPassword: ["", [Validators.required, 
                    Validators.pattern("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$")]]
            },
            {
                validator:MustMatch(
                    "password",
                    "confirmPassword"
                )
            }
        );
    }
    submit() {
        console.log("submit() called");

        //use form data to make code cleaner
        //exclude the un-needed confirmPassword field on submit
        const formData = this.signUpForm.getRawValue();
        this.dataToSend = {id:0, //default
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email, 
            password: formData.password
        };

        this.accountService.signUp(this.dataToSend).
            pipe(
                first(),
                catchError(error => this.handleError(error))
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

    handleError(error:string) {
        console.log(
            "Error: ",
            error
        );
        return EMPTY;
    }
    handleSignUpSuccess() {
        console.log("Sign-up was Successful!");
        this.router.navigate(["./login"]);
    }

}


