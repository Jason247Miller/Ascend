import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, take, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';
import { IWellnessRating } from 'src/app/models/IWellnessRating';
import { AlertService } from '../alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/IHabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';
import { IGuidedJournalLog } from 'src/app/models/IGuidedJournalLog';

@Injectable({ providedIn: 'root' })
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
    private guidedJournalEntriesUrl = 'api/guidedJournalEntries';
    private guidedJournalLogsUrl = 'api/guidedJournalLogs';
    private habitCompletionLogsUrl = 'api/habitCompletionLogs';
    constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {
    }
    setSidebarValue(display: boolean) {
        this.hideSideBarSubject.next(display);
    }
    setLocalStoreageUserSubject(localUser: string | null | User) {
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
                catchError(error => {
                    return this.handleError(
                        error,
                        'Email already exists in database!'
                    );
                })
            );
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('currentUser');
    }

    updateLocalStorageSubject(): void {
        this.localStorageUserSubject.next(localStorage.getItem('currentUser'));
    }

    updateHabitCompletionLogs(habitCompletionLogs: IHabitCompletionLog[]) {
        return combineLatest(habitCompletionLogs.map(
            log => this.http.put<IHabitCompletionLog>(this.habitCompletionLogsUrl, log)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error updating habit log:' + log.id);
                        console.error('Error updating habit log:' + log.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to update habit logs!:')),
                take(1)
            );

    }
    // updateGuidedjournalData(guidedJournalLogs: IGuidedJournalLog[]) {
    //     combineLatest(guidedJournalLogs.map(log => this.http.put<IGuidedJournalLog>(this.guidedJournalLogsUrl, log)
    //         .pipe(
    //             catchError(error => {
    //                 this.alertService.error('Error updating Guided Journal log:' + log.id);
    //                 return throwError(() => new Error(error))
    //             })
    //         )
    //     ))
    //         .pipe(
    //             catchError(error => this.handleError(error, 'Error: failed to update Guided Journal logs!:')),
    //             take(1)
    //         )

    //         .subscribe(() => {
    //             this.alertService.success("Journal Entries have been successfully Updated")
    //         });

    // }

    updateWellnessData(formData: IWellnessRating) {

        return this.http.put<IWellnessRating>(
            this.wellnessRatingsUrl,
            formData
        ).
            pipe(
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
                })
            );
    }

    handleError(error: string, customMessage?: string) {
        if (customMessage) {
            this.alertService.error(customMessage);
        } else {
            this.alertService.error(error);
        }
        console.error(error);
        return EMPTY;
    }
    addJournalRecordEntries(journalEntries: IGuidedJournalEntry[]) {

        return combineLatest(journalEntries.map(
            entry => this.http.post<IGuidedJournalEntry>(this.guidedJournalEntriesUrl, entry)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error submitting Entry log:' + entry.id);
                        console.error('Error submitting Journal Entry:' + entry.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                take(1),
                catchError(error => this.handleError(error, 'Error: failed to submit habit logs!:')),

            );

    }
    // addJournalRecordEntry(guidedJournalEntry: IGuidedJournalEntry) {
    //     return this.http.post<IGuidedJournalEntry>(
    //         this.guidedJournalEntriesUrl,
    //         guidedJournalEntry
    //     ).
    //         pipe(
    //             catchError(error => this.handleError(
    //                 error,
    //                 'Error:Failed to add Entry'
    //             ))
    //         );

    // }
    addJournalRecordLogs(guidedJournalLogs: IGuidedJournalLog[]) {

        return combineLatest(guidedJournalLogs.map(
            log => this.http.post<IGuidedJournalLog>(this.guidedJournalLogsUrl, log)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error updating journal log:' + log.id);
                        console.error('Error updating journal log:' + log.id);
                        return throwError(() => new Error(error))
                    }
                    ),
                    take(1)
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to update habit logs!:')),
                take(1)
            );


    }

    updateJournalRecordEntries(journalEntries: IGuidedJournalEntry[]) {

        return combineLatest(journalEntries.map(
            entry => this.http.put<IGuidedJournalEntry>(this.guidedJournalEntriesUrl, entry)
                .pipe(
                    take(1),
                    catchError(error => {
                        this.alertService.error('Error submitting Entry log:' + entry.id);
                        console.error('Error submitting Journal Entry:' + entry.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to submit habit logs!:')),
                take(1)
            );

    }

    updateJournalRecordLogs(journalLogs: IGuidedJournalLog[]) {
        return combineLatest(journalLogs.map(
            log => this.http.put<IGuidedJournalLog>(this.guidedJournalLogsUrl, log)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error updating journal log:' + log.id);
                        console.error('Error updating journal log:' + log.id);
                        return throwError(() => new Error(error))
                    }
                    ),
                    take(1)
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to update habit logs!:')),
                take(1)
            );
    }
    addWellnessRatingEntry(wellnessEntry: IWellnessRating) {
        return this.http.post<IWellnessRating>(
            this.wellnessRatingsUrl,
            wellnessEntry
        ).
            pipe(
                catchError(error => this.handleError(
                    error,
                    'Error:Failed to add wellnessRating'
                ))
            );
    }

    updateHabitEntries(habits: Habit[]) {
        return combineLatest(habits.map(
            habit => this.http.put<Habit>(this.habitsUrl, habit)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error submitting Entry log:' + habit.id);
                        console.error('Error submitting Journal Entry:' + habit.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to submit habit logs!:')),
                take(1)
            );

    }

    addHabitEntries(habits: Habit[]) {
        return combineLatest(habits.map(
            habit => this.http.post<Habit>(this.habitsUrl, habit)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error submitting Entry log:' + habit.id);
                        console.error('Error submitting Journal Entry:' + habit.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to submit habit logs!:')),
                take(1)
            );

    }
    updateHabitEntry(habit: Habit) {
        return this.http.put<Habit>(
            this.habitsUrl,
            habit
        ).
            pipe(
                catchError(error => this.handleError(
                    error,
                    'Error:Failed to update Habit Entry'
                ))
            );
    }

    addHabitCompletionLogs(habitCompletionLogs: IHabitCompletionLog[]) {
        return combineLatest(habitCompletionLogs.map(
            log => this.http.post<IHabitCompletionLog>(this.habitCompletionLogsUrl, log)
                .pipe(
                    catchError(error => {
                        this.alertService.error('Error submitting habit log:' + log.id);
                        console.error('Error submitting habit log:' + log.id);
                        return throwError(() => new Error(error))
                    })
                )
        ))
            .pipe(
                catchError(error => this.handleError(error, 'Error: failed to submit habit logs!:')),
                take(1)
            );


    }

    getHabitLogEntries(currentDate: string, userId: number) {
        return this.http.get<IHabitCompletionLog[]>(this.habitCompletionLogsUrl).
            pipe(
                map((habitLogs) => {

                    habitLogs = habitLogs.filter((habitLog) => {
                        return habitLog.date === currentDate && habitLog.userId === userId;
                    });
                    return habitLogs;
                }),
                catchError(error => {
                    return this.handleError(error, "Error occured querying current Habit Logs");
                })
            )
            }

    getJournalLogEntries(currentDate: string, userId: number) {
        return this.http.get<IGuidedJournalLog[]>(this.guidedJournalLogsUrl).
            pipe(
                map((journalLogs) => {

                    journalLogs = journalLogs.filter((journalLog) => {
                        return journalLog.date === currentDate && journalLog.userId === userId;
                    });
                    return journalLogs;
                })
                ,
                catchError(error => {
                    return this.handleError(error, "Error occured querying current Jounral Logs");
                })


            );
    }

    getJournalEntry(userId: number) {
        return this.http.get<IGuidedJournalEntry[]>(this.guidedJournalEntriesUrl).
            pipe(
                map((entries) => {

                    entries = entries.filter((entry) => {
                        return entry.userId === userId &&
                            !entry.deleted;
                    });
                    return entries;
                })
                ,
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
                    return rating;
                })
                ,
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
                }),
                catchError(error => {
                    return this.handleError(error, "Error occured in Wellness Entries Date Range");
                })

            );
    }
    generateUUID() {
        // generate a random UUID (source: https://stackoverflow.com/a/2117523)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
