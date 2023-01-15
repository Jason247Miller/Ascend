import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
 constructor(private fb : FormBuilder){}
 loginForm!: FormGroup;

  ngOnInit(): void {

   this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
   })
  }
  
  get password(){return this.loginForm.get('password'); }
  get email(){ return this.loginForm.get('email'); }

  login():void{
    console.warn("login called");
  }


}
