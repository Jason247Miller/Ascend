import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, first,tap } from 'rxjs';
import { User } from '../Users';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //Behavior Subject to emitt any changes of current user data to all subscribers 
  // the local storeage will be used to manage the login session, not the BehaviorSubject
  private currentUserSubject = new BehaviorSubject<User | string>("default"); 

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUserSubject(): BehaviorSubject<User | string> {
    return this.currentUserSubject; 
  }

  login(email: string, password: string){
    return this.http.post<User>('api/authenticate', {email, password}).pipe(
      first(), //emitt 1 item and close the Observable 
      tap(user =>{
       localStorage.setItem('currentUser', JSON.stringify(user));
       return user; 
      })
    ); 
  }

  logOut():void{
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next("default");
    this.router.navigate(['/login']);
  }

  signUp(userData:User){
  return this.http.post<User>('api/register', userData ) 
  }
  
  
}




