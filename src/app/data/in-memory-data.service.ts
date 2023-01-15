import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from '../Users';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
   return { 

   
    users: [
      { id: 1, firstName: 'Jason', lastName:'Miller', email:'jason.miller@yahoo.com', password:'testPass123!' },
      { id: 2, firstName: 'John', lastName:'Smith', email:'john@gmail.com', password:'testPass123!' }
    ]
  }
   
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (1).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  // genId(heroes: Hero[]): number {
  //   return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 1;
  // }
}