import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, first,of,Subject,tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
 export class AccountService {
  public redirectUrl?: string; 
  private currentUserSubject = new BehaviorSubject<User | string>("default"); 
  private localStorageUserSubject = new BehaviorSubject<User | string | null>("default");
  constructor(private http: HttpClient, private router: Router) {  
  }

  getCurrentUserSubject(): BehaviorSubject<User | string> {
    return this.currentUserSubject; 
  }
  getlocalStorageUserSubject(): BehaviorSubject<any> {
   return this.localStorageUserSubject; 
  }

  login(email: string, password: string){
    return this.http.post<User>('api/authenticate', {email, password}).pipe(
      first(), //emitt 1 item and close the Observable 
      tap(user =>{
       localStorage.setItem('currentUser', JSON.stringify(user));
       this.updateLocalStorageSubject(); 
       return user; 
      })
    ); 
  }

  logOut():void{
    console.log("logOut() called")
    localStorage.removeItem('currentUser');
    //this.currentUserSubject.next("default");
    this.localStorageUserSubject.next('default');
    this.router.navigate(['/login']);
  }

  signUp(userData:User){
  return this.http.post<User>('api/register', userData ).pipe(
    catchError(throwError)
  )
  
  
  }

  isLoggedIn():boolean{
    //return false if null or undefined, true otherwise!
    console.log("local user",localStorage.getItem('currentUser') )
     return !!localStorage.getItem('currentUser');  
  }
  
  updateLocalStorageSubject():void{
    this.localStorageUserSubject.next(localStorage.getItem('currentUser'));
  }
  
}




