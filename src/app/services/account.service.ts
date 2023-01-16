import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { User } from '../Users';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
/*
I will continue to build up this Account Service to handle authentication
once I learn more about observables, routing, httpClient, and tokens
*/
  constructor(private http: HttpClient) { }

  login(email: string, password: string){
    this.http.get<User[]>('api/users').pipe(
      map(users => users.filter(user => user.email === email && user.password === password))
    )
    .subscribe(user => {
      if(user){
        console.log("login successful");
      }
      else{
        console.log('Invalid username or password');
      }
    });
  }
}
