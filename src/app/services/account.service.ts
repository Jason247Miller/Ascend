import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, take } from 'rxjs';
import { User } from '../Users';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userDefault = {} as User; //Behavior Subjects require a default value 
  private currentUserSubject = new BehaviorSubject<User>(this.userDefault); //track current User
  constructor(private http: HttpClient) { }

  login(email: string, password: string){
    return this.http.post<User>('api/authenticate', {email, password}).pipe(
      map(user =>{
       localStorage.setItem('currentUser', JSON.stringify(user));
       
     
       this.currentUserSubject.next(user); //if user logs in successfully, emit that user as the CurrentUser in the subject
       return user; 
      }),
      take(1) //limit to 1 item, then close the data stream 
    ); 
  }
  
  
}



