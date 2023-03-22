import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { BehaviorSubject, delay, of } from 'rxjs';
import { User } from 'src/app/models/Users';
import { IGuidedJournalLog } from 'src/app/models/IGuidedJournalLog';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root', })
export class InMemoryDataService implements InMemoryDbService {
    private userSubject!: BehaviorSubject<User>;
    guidedJournalLogs: IGuidedJournalLog[];
    createDb() {
        return {
            users: [
                {
                    id: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    firstName: 'Jason',
                    lastName: 'Miller',
                    email: 'jason.miller@yahoo.com',
                    password: 'testPass123!'
                },
                {
                    id: 'a58a9560-3ed8-4eaa-b97e-c558179861e8',
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john@gmail.com',
                    password: 'testPass123!2'
                }
            ],

            wellnessRatings: [
                {
                    id: '8c8b043c-f34d-4198-a2fa-b875b96c37cc',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    date: '02-11-2023',
                    sleepRating: 5,
                    exerciseRating: 7,
                    nutritionRating: 8,
                    stressRating: 10,
                    sunlightRating: 3,
                    mindfulnessRating: 7,
                    productivityRating: 8,
                    moodRating: 6,
                    energyRating: 9,
                    overallDayRating: 7
                },
                {
                    id: '2fad9b2d-2404-4929-9d04-b06d8df9a95d',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    date: '02-07-2023',
                    sleepRating: 5,
                    exerciseRating: 7,
                    nutritionRating: 3,
                    stressRating: 6,
                    sunlightRating: 3,
                    mindfulnessRating: 7,
                    productivityRating: 2,
                    moodRating: 6,
                    energyRating: 9,
                    overallDayRating: 7
                },
                {
                    id: 'e33cbdb2-e1e6-4893-ad52-74c3906c41ac',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    date: '02-17-2023',
                    sleepRating: 5,
                    exerciseRating: 2,
                    nutritionRating: 3,
                    stressRating: 5,
                    sunlightRating: 3,
                    mindfulnessRating: 7,
                    productivityRating: 1,
                    moodRating: 6,
                    energyRating: 3,
                    overallDayRating: 7
                },
                {
                    id: 'b114860a-0edf-40f0-898c-94cd69305ac5',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    date: '01-06-2023',
                    sleepRating: 5,
                    exerciseRating: 0,
                    nutritionRating: 0,
                    stressRating: 0,
                    sunlightRating: 0,
                    mindfulnessRating: 0,
                    productivityRating: 0,
                    moodRating: 0,
                    energyRating: 0,
                    overallDayRating: 7
                }
            ],

            habitCompletionLogs: [
                {
                    id: 'dc755854-c76c-4960-883e-2c792e5ca1f8',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    completed: false,
                    date: '02-17-2023'
                },
                {
                    id: '96a8a12e-ffda-44c1-bcfd-580a9e3c8b0a',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitId: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    completed: false,
                    date: '02-17-2023'
                },
                {
                    id: '9572a061-2f81-4b1a-b101-8bbabfa7fe9b',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    completed: true,
                    date: '02-11-2023'
                },
                {
                    id: '32205731-9ea7-4f3b-ba8b-ed9b19c3fbaa',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitId: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    completed: true,
                    date: '02-11-2023'
                }

            ],
            habits: [
                {
                    id: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitName: 'Play Guitar for 20 minutes a day',
                    deleted: false,
                    creationDate: '02-11-2023'
                },
                {
                    id: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitName: 'Cardio for 30 minutes',
                    deleted: false,
                    creationDate: '02-11-2023'
                },
                {
                    id: '2e2bd1d4-c4a3-475a-bc8a-5aea1157e0ec',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    habitName: 'Meditate for 10 minutes',
                    deleted: true,
                    creationDate: '02-11-2023'
                }
            ],
            guidedJournalEntries: [
                {
                    id: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryName: 'What are you most greatful for?',
                    deleted: false,
                    creationDate: '03-22-2023'
                },
                {
                    id: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryName: 'what did you learn today?',
                    deleted: false,
                    creationDate: '03-22-2023'
                }
            ],
            guidedJournalLogs: [
                {
                    id: 'c35a7756-7b06-4abe-970d-fd2dbbdab1f2',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryTextValue: 'my health',
                    date: '02-17-2023'
                },

                {
                    id: '5e794542-7aef-4373-8ca6-e8095e84a15e',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryId: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    entryTextValue: 'how to enjoy the moment',
                    date: '02-17-2023'
                },
                {
                    id: '2f8cc6e0-3146-461a-b4bf-f18d184ce651',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryTextValue: '',
                    date: '02-11-2023'
                },
                {
                    id: '12b72366-f8db-43f0-9e65-9e50a4fe70b5',
                    userId: 'd58a9560-3ed8-4eaa-b97e-c558179861e8',
                    entryId: '2e2bd1d4-c4a3-475a-bc8a-5aea1156e0ec',
                    entryTextValue: '',
                    date: '02-11-2023'
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
        } else if (reqInfo.collectionName === 'register') {
            return this.register(reqInfo);
        }
        else if (reqInfo.collectionName === 'habitCompletionLogs') {
            return this.addHabitCompletionLogs(reqInfo);
        }
        else if (reqInfo.collectionName === 'guidedJournalLogs') {
            console.log("server if reached")
            return this.addGuidedJournalLogs(reqInfo);
        }
        else if (reqInfo.collectionName === 'guidedJournalEntries') {
            return this.addGuidedJournalEntries(reqInfo);
        }
        else if (reqInfo.collectionName === 'habits') {
            return this.addHabits(reqInfo);
        }

        return undefined;
    }

    addHabits(reqInfo: any) {
        const requestBody = reqInfo['req']['body'];
        requestBody["id"] = this.genId(this.db.habits);
        this.db.habits.push(requestBody);
    }
    addGuidedJournalEntries(reqInfo: any) {
        const requestBody = reqInfo['req']['body'];
        requestBody["id"] = this.genId(this.db.guidedJournalEntries);
        this.db.guidedJournalEntries.push(requestBody);
    }
    addGuidedJournalLogs(reqInfo: any) {
        const requestBody = reqInfo['req']['body'];
        console.log("add guided journal logs server reached", requestBody);
        requestBody["id"] = this.genId(this.db.guidedJournalLogs);
        this.db.guidedJournalLogs.push(requestBody);
    }
    addHabitCompletionLogs(reqInfo: any) {

        const requestBody = reqInfo['req']['body'];
        requestBody["id"] = this.genId(this.db.habitCompletionLogs);
        this.db.habitCompletionLogs.push(requestBody);
    }
    register(reqInfo: any) {

        const requestBody = reqInfo['req']['body'];
        const id: string = this.genId(this.db.users);
        requestBody['id'] = id;

        //return error if email is already in db 
        if (this.db.users.find(x => x.email === requestBody['email'])) {
            throw Error('Email "' + requestBody['email'] + '" is already registered with us');
        } else {
            this.db.users.push(requestBody);
        }

        return of(new HttpResponse({ status: 200 })).
            pipe(delay(500)); //mimic server delay
    }
    //not currently used
    logout(reqInfo: any) {
        return reqInfo.utils.createResponse$(() => {
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
                body: { error: 'Error 401 Invalid Email or Password' }
            };

        });
    }

    genId(entries: any): string {
        return this.generateGuid();
    }

    private generateGuid(): string {
        return uuidv4();
    }
    
}
