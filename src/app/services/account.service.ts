import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, take } from 'rxjs';
import { User } from '../Users';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //allow current user to default to null before log on 
  public currentUserSubject = new BehaviorSubject<User | null>(null); 

  constructor(private http: HttpClient) {}

  login(email: string, password: string){
    return this.http.post<User>('api/authenticate', {email, password}).pipe(
      map(user =>{
       //set currentUser in local storeage to maintain session after page refresh
       localStorage.setItem('currentUser', JSON.stringify(user));

       return user; 
      }),
      take(1) //limit to 1 item, then close the data stream 
    ); 
  }
  logOut(){
    this.currentUserSubject.next(null);
  }
  
  
}



