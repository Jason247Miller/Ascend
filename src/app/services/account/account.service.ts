import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, first,map,of,Subject,take,tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';
import { wellnessRating } from 'src/app/models/WellnessRating';


@Injectable({
    providedIn: 'root'
})
export class AccountService {
    public redirectUrl?: string; 
    private currentUserSubject = new BehaviorSubject<User | string>("default"); 
    public currentUser$ = this.currentUserSubject.asObservable(); 
    private localStorageUserSubject = new BehaviorSubject<User | string | null>("default");
    public localStorageUser$ = this.localStorageUserSubject.asObservable(); 
    constructor(private http: HttpClient, private router: Router) {  
    }

     setLocalStoreageUserSubject(localUser:string|null|User){
       
        this.localStorageUserSubject.next(localUser);
     }
    getLocalStoreageUser$(){
        return this.localStorageUserSubject.asObservable(); 
    }
      

    login(email: string, password: string) {
        return this.http.post<User>(
            'api/authenticate',
            {email, password}
        ).pipe(
            first(), //emitt 1 item and close the Observable 
            tap(user => {
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(user)
                );
                this.updateLocalStorageSubject(); 
                return user; 
            })
        ); 
    }

    logOut():void {

  
        localStorage.removeItem('currentUser');
        //this.currentUserSubject.next("default");
        this.localStorageUserSubject.next('default');
        this.router.navigate(['/login']);
    }

    signUp(userData:User) {
        return this.http.post<User>(
            'api/register',
            userData
        ).
            pipe(
                tap(item => console.log(item)),
                catchError(error => {
                    throw 'Email already exists in database!';
                })
            ); 
    }

    isLoggedIn():boolean {
    //return false if null or undefined, true otherwise!
        console.log(
            "local user",
            localStorage.getItem('currentUser')
        );
        return !!localStorage.getItem('currentUser');  
    }
  
    updateLocalStorageSubject():void {
        this.localStorageUserSubject.next(localStorage.getItem('currentUser'));
    }

    entryExistsForCurrentDate(currentDate:string){
       
        return this.http.get<wellnessRating[]>('api/wellnessRatings')
        .pipe(
            
            take(1),
            map((wellnessRating) => {
              
                wellnessRating = wellnessRating.filter((item) => {
                    return item.date === currentDate
                }
                )
            
            return wellnessRating;
            }
            )
            ,
            tap(item => console.log(item))
           
            
        )

        

    }
  
}


function typeOf(item: wellnessRating[]): any {
    throw new Error('Function not implemented.');
}

