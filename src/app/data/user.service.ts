import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { User } from '../Users';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'api/users';  // URL to web api
  constructor(private http: HttpClient){}
    
  user: User = {id: 1, firstName: 'Jason', lastName:'Miller', email:'jason.miller@yahoo.com', password:'testPass123!'}
  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }
  handleError<T>(arg0: string, arg1: never[]): any {
    throw new Error('There was an error');
  }
}
