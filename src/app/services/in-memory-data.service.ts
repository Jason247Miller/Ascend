import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { RequestInfo } from 'angular-in-memory-web-api';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Users';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  private userSubject!: BehaviorSubject<User>;
  createDb() 
  {
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
  }
  }
  // HTTP POST interceptor
  post(reqInfo: any) {
    //
    if (reqInfo.collectionName === 'authenticate'){   
      //called when loginForm is Submitted
      return this.authenticate(reqInfo)
    }    
    else if (reqInfo.collectionName === 'logout') {
      return this.logout(reqInfo);
  }
    //  otherwise default response of In-memory DB
    return undefined
}

logout(reqInfo: RequestInfo) {
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
    // HTTP POST interceptor handler
    private authenticate(reqInfo: any) {
      const db = this.createDb();
      const requestBody = reqInfo["req"]["body"]; 
      // return an Observable response
      return reqInfo.utils.createResponse$(() => {
          console.log('HTTP POST api/authentication override')
          const { headers, url } = reqInfo.utils.getJsonBody(reqInfo.req);
          const email = requestBody['email'];
          console.log('email=' + email)
          const password = requestBody["password"]; 
          const user = db.users.find(u => u.email === email && u.password === password);
          console.log('after db.users search')
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
              }
          //  otherwise return response with status code 401 (unauthorized)
          return { 
            status: 401, 
            headers, 
            url, 
            body: {error: 'Invalid Email or Password' } 
          }
      })
  }
  
  //Ensure there is never a duplicate id when adding users 
   genId(users: User[]): number {
     return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
   }

}
  
    