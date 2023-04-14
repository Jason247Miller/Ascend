import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Subject, take, tap, throwError } from 'rxjs';
import { User } from 'src/app/models/Users';
import { Router } from '@angular/router';
import { IWellnessRating } from 'src/app/models/IWellnessRating';
import { AlertService } from '../alert/alert.service';
import { Habit } from 'src/app/models/Habit';
import { IHabitCompletionLog } from 'src/app/models/IHabitCompletionLog';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';
import { IGuidedJournalLog } from 'src/app/models/IGuidedJournalLog';
import { MsalService } from '@azure/msal-angular';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly _destroying$ = new Subject<void>();
    public redirectUrl?: string;
    private currentUserSubject = new BehaviorSubject<User | string>("default");
    public currentUser$ = this.currentUserSubject.asObservable();
    private hideSideBarSubject = new BehaviorSubject(false);
    public hideSideBar$ = this.hideSideBarSubject.asObservable();
    private wellnessRatingsUrl = 'api/wellnessRatings/';
    private habitsUrl = 'api/habits';
    private guidedJournalEntriesUrl = 'api/guidedJournalEntries/';
    private guidedJournalLogsUrl = 'api/guidedJournalLogs/';
    private habitCompletionLogsUrl = 'api/habitCompletionLogs/';
    constructor(private http: HttpClient,
                private router: Router,
                private alertService: AlertService,
                private authService: MsalService,
                private msalService: MsalService)
 {
    }
    setSidebarValue(display: boolean) {
        this.hideSideBarSubject.next(display);
    }

     getUserOid() {
        const accounts = this.msalService.instance.getAllAccounts();
        console.log("accounts ", accounts); 
        if (accounts.length > 0) {
            const account = accounts[0];
            console.log("OID = ", account.idTokenClaims?.oid);
            return account.idTokenClaims?.oid
          }
        return "";
     }
    
    login():void {
       this.authService.loginRedirect()
        .subscribe({
            next:(result) => {
                console.log(result); 
              //  this.set
            }
        });
        
        
    }

    updateHabitCompletionLogs(habitCompletionLogs: IHabitCompletionLog[]) {
        return combineLatest(habitCompletionLogs.map(
            log => this.http.put<IHabitCompletionLog>(this.habitCompletionLogsUrl + log.id, log)
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

    updateWellnessData(formData: IWellnessRating) {

        return this.http.put<IWellnessRating>(
            this.wellnessRatingsUrl + formData.id,
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

    getHabits(userId: string, date: string) {
       
        const today = new Date().toISOString().substring(0,10);
        const dailyReviewDate = new Date(date).toISOString().substring(0,10);
       
        console.log("today date = ", today);
        console.log("dailyReviewDate =", dailyReviewDate); 
        return this.http.get<Habit[]>(this.habitsUrl).
            pipe(
                map(habits => {
                    habits = habits.filter((habit) => {
                        const habitCreationDate = new Date(habit.creationDate).toISOString().substring(0,10);
                        if (habitCreationDate === today) {
                            return habit.userId === userId &&
                                habit.deleted === false;
                        }
                        else {
                            //show include deleted habits if viewing report from previous date
                            console.log("date is older than today");
                            console.log("habit.userId=", habit.userId);
                            console.log("userId=", userId);
                            return habit.userId === userId && habitCreationDate === dailyReviewDate;
                        }
                    });
                    console.log("habits = ", habits); 
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
            entry => this.http.post<IGuidedJournalEntry>(this.guidedJournalEntriesUrl + entry.id, entry)
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
            log => this.http.put<IGuidedJournalLog>(this.guidedJournalLogsUrl + log.id, log)
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
            habit => this.http.put<Habit>(this.habitsUrl + habit.id, habit)
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

    getHabitLogEntries(currentDate: string, userId: string) {
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

    getJournalLogEntries(currentDate: string, userId: string) {
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

    getJournalEntry(userId: string, date: string) {

        const dailyReviewDate = new Date(date).toDateString();
        const today = new Date().toDateString();

        return this.http.get<IGuidedJournalEntry[]>(this.guidedJournalEntriesUrl).
            pipe(
                map((entries) => {
                    entries = entries.filter((entry) => {
                        const entryCreationDate = new Date(entry.creationDate).toDateString();
                        if (entryCreationDate === today) {
                            return entry.userId === userId &&
                                entry.deleted === false;
                        }
                        else {
                            //show include deleted entries if viewing report from previous date
                            return entry.userId === userId && entryCreationDate === dailyReviewDate;
                        }
                    });
                    return entries;
                })
                ,
                catchError(error => {
                    return this.handleError(error, "Error occured in journal entry exists query");
                })

            );
    }

    getWellnessEntryByDate(date: string, userId: string) {

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

    getWellnessEntriesInDateRange(oldestDate: Date, latestDate: Date, userId: string) {
        return this.http.get<IWellnessRating[]>(this.wellnessRatingsUrl).
            pipe(
                map((wellnessRatings) => {

                    wellnessRatings = wellnessRatings.filter((entry) => {
                        let entryDate = new Date(entry.date);
                        return (entryDate >= oldestDate) && (entryDate <= latestDate) && entry.userId === userId;
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
