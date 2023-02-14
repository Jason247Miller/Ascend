import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { BehaviorSubject, delay, of } from 'rxjs';
import { User } from 'src/app/models/Users';
import { IGuidedJournalEntry } from 'src/app/models/IGuidedJournalEntry';
import { Habit } from 'src/app/models/Habit';
import { IWellnessRating } from 'src/app/models/wellness-rating';
import { IHabitCompletionLog } from 'src/app/models/HabitCompletionLog';
@Injectable({
    providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
    private userSubject!: BehaviorSubject<User>;
    createDb() {
        return { 
            users: [
                { id: 1,
                    firstName: 'Jason',
                    lastName:'Miller',
                    email:'jason.miller@yahoo.com',
                    password:'testPass123!' 
                },
                { id: 2,
                    firstName: 'John',
                    lastName:'Smith',
                    email:'john@gmail.com',
                    password:'testPass123!2' 
                }
            ],
        
            wellnessRatings:[              
                { id: 1,
                    userId: 1,
                    date:'6-2-2023',
                    sleepRating:5,
                    exerciseRating:7,
                    nutritionRating:8,
                    stressRating:10,
                    sunlightRating:3,
                    mindfulnessRating:7,
                    productivityRating:8,
                    moodRating:6,
                    energyRating:9,
                    overallDayRating:7
                },
                { id: 2,
                    userId: 1,
                    date:'6-1-2023',
                    sleepRating:5,
                    exerciseRating:0,
                    nutritionRating:0,
                    stressRating:0,
                    sunlightRating:0,
                    mindfulnessRating:0,
                    productivityRating:0,
                    moodRating:0,
                    energyRating:0,
                    overallDayRating:7
                }
            ],

            habitCompletionLogs:[
                {
                    id: 1,
                    userId: 1,
                    habitId:1,
                    completed: true,
                    date:'6-2-2023'
                },
                {
                    id: 2,
                    userId: 1,
                    habitId: 2,
                    completed: false,
                    date:'6-2-2023'
                },
                {
                    id: 3,
                    userId: 1,
                    habitId: 3,
                    completed: true,
                    date:'6-2-2023'
                }
            ],
            habits:[
                {
                    id:1, 
                    userId: 1, 
                    habitName:'Play Guitar for 20 minutes a day'
                },
                {
                    id:2, 
                    userId: 1, 
                    habitName:'Cardio for 30 minutes'
                },
                {
                    id:3, 
                    userId: 1, 
                    habitName:'Meditate for 10 minutes'
                }
            ],
            guidedJournalEntries:[
                {
                    id:1, 
                    userId: 1, 
                    date:'6-2-2023',
                    gratitudeEntry: 'my job, my gf, my family',
                    highlightEntry: 'maintained focus throughout the day',
                    learnedEntry: 'learned about RouteActiveLink',
                    contributeEntry: 'made dinner for my gf',
                    generalEntry: 'nothing much else to add'
                },
                {
                    id:2, 
                    userId: 2, 
                    date:'6-2-2023',
                    gratitudeEntry: 'test',
                    highlightEntry: 'test',
                    learnedEntry: 'test',
                    contributeEntry: 'test',
                    generalEntry: 'test'
                }
            ]
        };
    }
    db = this.createDb();

    // HTTP POST interceptor
    post(reqInfo: any) {
    //
        if (reqInfo.collectionName === 'authenticate') {   
            //called when loginForm is Submitted
            return this.authenticate(reqInfo);
        } else if (reqInfo.collectionName === 'logout') {
            return this.logout(reqInfo);
        } else if(reqInfo.collectionName === 'register') {
            return this.register(reqInfo);
        } else if(reqInfo.collectionName === 'habitCompletionLogs') {
            return this.addHabitCompletionLogs(reqInfo);
        }
        
      
        return undefined;
    }
   
   

    addHabitCompletionLogs(reqInfo:any) {
      
        const requestBody = reqInfo['req']['body']; 
        requestBody["id"] = this.genId(this.db.habitCompletionLogs);//generate an id that does not exist
        this.db.habitCompletionLogs.push(requestBody); 
    }
    register(reqInfo:any) {

        const requestBody = reqInfo['req']['body']; 
        const id:number = this.genId(this.db.users);//generate an id that does not exist
        requestBody['id'] = id;

        //return error if email is already in db 
        if (this.db.users.find(x => x.email === requestBody['email'])) {
            throw Error('Email "' + requestBody['email'] + '" is already registered with us');
        } else{
            this.db.users.push(requestBody); 
        }

        return of(new HttpResponse({status: 200})).
            pipe(delay(500)); //mimic server delay
    }
   
 
    //not currently used
    logout(reqInfo: any) {
        return reqInfo.utils.createResponse$(() => {
            console.log('HTTP POST api/logout override');
            const { headers, url } = reqInfo;
            return {
                status: 200,
                headers,
                url,
                body: {}
            };
        });
    }

    // mocking authentication happens here
    private authenticate(reqInfo: any) {
        const requestBody = reqInfo["req"]["body"]; 
        // return an Observable response
        return reqInfo.utils.createResponse$(() => {
            console.log('HTTP POST api/authentication override');
            const { headers, url } = reqInfo.utils.getJsonBody(reqInfo.req);
            const email = requestBody['email'];
            const password = requestBody["password"]; 
            const user = this.db.users.find(u => u.email === email && u.password === password);
            if (user)
                return { 
                    status: 200, 
                    headers, // reqInfo (line 30)
                    url, // reqInfo (line 30)
                    body: { 
                        id: user.id, 
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
                    } 
                };
            //  otherwise return response with status code 401 (unauthorized)
            return { 
                status: 401, 
                headers, 
                url, 
                body: {error: 'Error 401 Invalid Email or Password'} 
            }; 

          
        });
    }

    genId(entries: User[] | IWellnessRating[] | Habit[] | IGuidedJournalEntry[]|IHabitCompletionLog[] ): number {
        return entries.length > 0 ? Math.max(...entries.
            map((entry: { id: number; }) => entry.id)) + 1 : 1;
    }
   
}
  
    