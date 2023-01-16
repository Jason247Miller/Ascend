import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MustMatch } from '../helpers/mustmatch';
/*
The password regular expression enforces the following rules for the password:
Must contain at least one uppercase letter
Must contain at least one special character (!@#$%^&*)
Must contain at least one digit
Must contain at least one lowercase letter
Must be at least 8 characters long
*/

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder){}

  signUpForm!: FormGroup;
 
ngOnInit(): void {
  
    this.signUpForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$')]],
    confirmPassword: ['', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$')]]
  }, {
    validator:MustMatch('password', 'confirmPassword')
  });
}
submitUser(){
 console.warn(this.signUpForm.value);
}

get firstName(){ return this.signUpForm.get('firstName');}
get lastName(){ return this.signUpForm.get('lastName');}
get email(){ return this.signUpForm.get('email');}
get password(){ return this.signUpForm.get('password');}
get confirmPassword(){ return this.signUpForm.get('confirmPassword');}
  

}



