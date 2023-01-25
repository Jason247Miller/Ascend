import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { BehaviorSubject, delay, of } from 'rxjs';
import { User } from '../Users';

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
        }
        //  otherwise default response of In-memory DB
        return undefined;
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
                body: {error: 'Error 401 Invalid Email or Password' } 
            }; 

          
        });
    }
    //Ensure there is never a duplicate id when adding users 
    genId(users: User[]): number {
        return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    }
   
}
  
    