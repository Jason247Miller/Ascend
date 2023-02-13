import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, first, map, Observable, of, Subject, take, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { AlertService } from '../alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/HabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/GuidedJournalEntry';
import { IGuidedJournalLog } from 'src/app/models/GuidedJournalLog';


@Injectable({
    providedIn: 'root'
})
export class AccountService {

    public redirectUrl?: string;
    private currentUserSubject = new BehaviorSubject<User | string>("default");
    public currentUser$ = this.currentUserSubject.asObservable();
    private localStorageUserSubject = new BehaviorSubject<User | string | null>("default");
    public localStorageUser$ = this.localStorageUserSubject.asObservable();
    private hideSideBarSubject = new BehaviorSubject(false);
    public hideSideBar$ = this.hideSideBarSubject.asObservable();
    private wellnessRatingsUrl = 'api/wellnessRatings';
    private habitsUrl = 'api/habits';
    private guidedJournalUrl = 'api/guidedJournalEntries';
    private guidedJournalLogsUrl = 'api/guidedJournalLogs';
    private habitCompletionLogsUrl = 'api/habitCompletionLogs';
    constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {
    }
    setSidebarValue(display: boolean) {
        this.hideSideBarSubject.next(display);
    }
    setLocalStoreageUserSubject(localUser: string | null | User) {
        console.log(
            "localUser",
            localUser
        );
        this.localStorageUserSubject.next(localUser);
    }
    getLocalStoreageUser$() {
        return this.localStorageUserSubject.asObservable();
    }


    login(email: string, password: string) {
        return this.http.post<User>(
            'api/authenticate',
            { email, password }
        ).pipe(
            tap(user => {
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(user)
                );
                this.updateLocalStorageSubject();
                return user;
            }),
            catchError(error => this.handleError(
                error,
                'User name or password is incorrect!'
            ))
        );
    }

    logOut(): void {

        localStorage.removeItem('currentUser');
        //this.currentUserSubject.next("default");
        this.localStorageUserSubject.next('default');
        this.router.navigate(['/login']);
    }

    signUp(userData: User) {
        return this.http.post<User>(
            'api/register',
            userData
        ).
            pipe(
                tap(item => console.log(item)),
                catchError(error => {
                    return this.handleError(
                        error,
                        'Email already exists in database!'
                    );
                })
            );
    }

    isLoggedIn(): boolean {
        //return false if null or undefined, true otherwise!
        console.log(
            "local user",
            localStorage.getItem('currentUser')
        );
        return !!localStorage.getItem('currentUser');
    }

    updateLocalStorageSubject(): void {
        this.localStorageUserSubject.next(localStorage.getItem('currentUser'));
    }

    updateHabitCompletionLogs(habitCompletionLogs: IHabitCompletionLog[]) {
        let completed: number = 0;
        console.log("habit logs length", habitCompletionLogs.length)
        habitCompletionLogs.forEach(log => {

            this.http.put<IHabitCompletionLog>(
                this.habitCompletionLogsUrl,
                log
            ).
                pipe(
                    take(1),
                    catchError(error => {
                        return this.handleError(
                            error,
                            'Error: Failed to submit 1 or more habit logs'
                        );
                    })
                ).
                subscribe(() => {
                    completed++;
                    console.log("completed=" , completed)
                    console.log("habitCompletionLogs.length=" , habitCompletionLogs.length)
                    if (completed === habitCompletionLogs.length) {
                        this.alertService.success('Updated Habit Logs Successfully');
                    }
                }

                );
        });


    }

    updateGuidedjournalData(formData: IGuidedJournalEntry) {
        return this.http.put(
            this.guidedJournalUrl,
            formData
        ).
            pipe(
                tap(guidedJournalEntry => console.log(
                    "updated guided journal entry",
                    guidedJournalEntry
                )),
                catchError(error => {
                    return this.handleError(
                        error,
                        'Error:Failed to Update guided journal entry'
                    );
                })
            );
    }

    updateWellnessData(formData: IWellnessRating) {

        return this.http.put(
            this.wellnessRatingsUrl,
            formData
        ).
            pipe(
                tap(rating => console.log(
                    "updated wellness rating",
                    rating
                )),
                catchError(error => {
                    return this.handleError(
                        error,
                        'Error:Failed to Update wellness entry'
                    );
                })
            );


    }

    getHabits(userId: number) {
        return this.http.get<Habit[]>(this.habitsUrl).
            pipe(
                map(habits => {
                    habits = habits.filter((habit) => {
                        return habit.userId === userId && habit.deleted === false;
                    });
                    return habits;
                }),
                tap(habits => {
                    console.log(
                        'habits with userId passed=',
                        habits
                    );
                })
            );
    }

    handleError(error: string, customMessage?: string) {
        if (customMessage) {
            this.alertService.error(customMessage);
            console.log(customMessage);
        } else {
            this.alertService.error(error);
        }
        console.error(error);
        return EMPTY;
    }

    addJournalRecordEntry(guidedJournalEntry: IGuidedJournalEntry) {
        console.log('inside add journal record entry');
        return this.http.post<IGuidedJournalEntry>(
            this.guidedJournalUrl,
            guidedJournalEntry
        ).
            pipe(
                tap(guidedJournalEntry => console.log(
                    'added new journal entry: ',
                    guidedJournalEntry
                )),
                catchError(error => this.handleError(
                    error,
                    'Error:Failed to add guided journal entry'
                ))
            );
    }

    addWellnessRatingEntry(wellnessEntry: IWellnessRating) {
        console.log('inside wellness rating add');
        return this.http.post<IWellnessRating>(
            this.wellnessRatingsUrl,
            wellnessEntry
        ).
            pipe(
                tap(wellnessRating => {
                     console.log('added new wellness rating: ',wellnessRating);
                }),
                catchError(error => this.handleError(
                    error,
                    'Error:Failed to add wellnessRating'
                ))
            );
    }

    addHabitCompletionLogs(habitCompletionLogs: IHabitCompletionLog[]) {
        let completed: number = 0;
        habitCompletionLogs.forEach(log => {
            console.log('addHabitCompletionLogs called');
            this.http.post<IHabitCompletionLog>(
                this.habitCompletionLogsUrl,
                log
            ).
                pipe(
                    take(1),
                    catchError(error => {
                        return this.handleError(
                            error,
                            'Error: Failed to submit 1 or more habit logs'
                        );
                    })
                ).
                subscribe(() => {
                    completed++;
                    if (completed === habitCompletionLogs.length) {
                       console.log("habit logs have been added successfully");
                       this.alertService.success("Added Habit Review Logs Successfully");
                    }
                });
        });


    }

    viewHabitCompletionEntries() {
        console.log("view habit logs");
        return this.http.get<IHabitCompletionLog[]>(this.habitCompletionLogsUrl).
            pipe(tap(logs => {
                console.log(
                    'habit logs=',
                    logs
                );
            }));


    }

    getHabitLogEntries(currentDate: string, userId: number) {
        return this.http.get<IHabitCompletionLog[]>(this.habitCompletionLogsUrl).
            pipe(
                map((habitLogs) => {

                    habitLogs = habitLogs.filter((habitLog) => {
                        return habitLog.date === currentDate && habitLog.userId === userId;
                    });
                    console.log(
                        'current date entry=',
                        habitLogs
                    );
                    return habitLogs;
                })
                ,
                tap(logs => console.log("current habit logs", logs)),

                catchError(error => {
                    return this.handleError(error, "Error occured querying current Habit Logs");
                })


            );
    }

    getJournalLogEntries(currentDate: string, userId: number){
        return this.http.get<IGuidedJournalLog[]>(this.guidedJournalLogsUrl).
        pipe(
            map((journalLogs) => {

                journalLogs = journalLogs.filter((journalLog) => {
                    return journalLog.date === currentDate && journalLog.userId === userId;
                });
                console.log(
                    'current date jounral log entry=',
                    journalLogs
                );
                return journalLogs;
            })
            ,
            tap(logs => console.log("current jounral logs", logs)),

            catchError(error => {
                return this.handleError(error, "Error occured querying current Jounral Logs");
            })

        );
    }

    getJournalEntry(datePassed: string, userId: number) {
        return this.http.get<IGuidedJournalEntry[]>(this.guidedJournalUrl).
            pipe(
                map((entries) => {

                    entries = entries.filter((entry) => {
                        return entry.userId === userId &&
                              !entry.deleted;
                    });
                    console.log(
                        'current journal date entry=',
                        entries
                    );
                    return entries;
                })
                ,
                tap(entries => console.log("journal entry array retrieved", entries)),

                catchError(error => {
                    return this.handleError(error, "Error occured in journal entry exists query");
                })


            );
    }

    getWellnessEntryByDate(date: string, userId: number) {

        return this.http.get<IWellnessRating[]>(this.wellnessRatingsUrl).
            pipe(
                map((rating) => {

                    rating = rating.filter((entry) => {
                        return entry.date === date && entry.userId === userId;
                    });
                    console.log(
                        'current date entry=',
                        rating
                    );
                    return rating;
                })
                ,
                tap(item => console.log(item)),

                catchError(error => {
                    return this.handleError(error, "Error occured in wellness rating exists query");
                })


            );
    }

    getWellnessEntriesInDateRange(oldestDate: Date, latestDate: Date, userId: number) {
        return this.http.get<IWellnessRating[]>(this.wellnessRatingsUrl).
            pipe(
                map((wellnessRatings) => {

                    wellnessRatings = wellnessRatings.filter((entry) => {
                        let entryDate = new Date(entry.date);
                        return (entryDate >= oldestDate) && (entryDate <= latestDate);
                    });

                    return wellnessRatings;
                })
                ,
                tap(wellnessRatings => console.log('Wellness Ratings in Range', wellnessRatings)),

                catchError(error => {
                    return this.handleError(error, "Error occured in Wellness Entries Date Range");
                })


            );
    }

}


