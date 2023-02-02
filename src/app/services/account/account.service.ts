import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, first,map,Observable,of,Subject,take,tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { AlertService } from '../alert/alert.service';



@Injectable({
    providedIn: 'root'
})
export class AccountService {
    public redirectUrl?: string; 
    private currentUserSubject = new BehaviorSubject<User | string>("default"); 
    public currentUser$ = this.currentUserSubject.asObservable(); 
    private localStorageUserSubject = new BehaviorSubject<User | string | null>("default");
    public localStorageUser$ = this.localStorageUserSubject.asObservable(); 
    private wellnessRatingsUrl = 'api/wellnessRatings'; 
    constructor(private http: HttpClient, private router: Router, private alertService:AlertService) {  
    }

     setLocalStoreageUserSubject(localUser:string|null|User){
         console.log("localUser", localUser);
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
            tap(user => {
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(user)
                );
                this.updateLocalStorageSubject(); 
                return user; 
            }),
            catchError(error => this.handleError(error, 'User name or password is incorrect!'))
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
                   return this.handleError(error,'Email already exists in database!' );   
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

    updateWellnessData(formData:IWellnessRating):Observable<any>{
        return this.http.put(this.wellnessRatingsUrl,formData)
        .pipe(
                tap(rating => console.log("updated wellness rating", rating)),
                catchError(error => {
                   return  this.handleError(error, 'Error:Failed to Update wellness entry');
                })
            ); 
    
    
    }
    
    handleError(error:string, customMessage?:string ) {
       if(customMessage){
        this.alertService.error(customMessage);
        console.log(customMessage);
       }
       else{
        this.alertService.error(error);
       }
       console.error(error);
        return EMPTY;
    }

    addWellnessRatingEntry(wellnessEntry: IWellnessRating){
        console.log('inside wellness rating add')
     return this.http.post<IWellnessRating>(this.wellnessRatingsUrl, wellnessEntry)
     .pipe(
        tap(wellnessRating => console.log("added new wellness rating: ", wellnessRating)),
        catchError(error => this.handleError(error, 'Error:Failed to add wellnessRating'))
     )

    }

    entryExistsForCurrentDate(currentDate:string, userId:number){
       
        return this.http.get<IWellnessRating[]>('api/wellnessRatings')
        .pipe(
            
            take(1),
            map((rating) => {
              
                rating = rating.filter((entry) => {
                    return ((entry.date === currentDate) && (entry.userId === userId))
                })
                console.log('current date entry=', rating);
                return rating; 
            }
            
            )
            ,
            tap(item => console.log(item))
           
            
        )

        

    }
  
}



