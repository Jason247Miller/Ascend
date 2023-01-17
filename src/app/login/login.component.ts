import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

 constructor(private fb : FormBuilder, private accountService: AccountService){}
 loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
   })
  }

  get password(){return this.loginForm.get('password'); }
  get email(){ return this.loginForm.get('email'); }

  submit(){
    if(this.loginForm.invalid){return;}
    console.log("submit() called")
    this.accountService.login(this.email?.value, this.password?.value)
    .subscribe(
      user => {
        console.log("Successfully logged in user:" + user.firstName)
      }
    )
  }
     
}
