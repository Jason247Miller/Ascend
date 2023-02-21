export class Habit {

    fields:[]; 
    constructor(

      public id: number,
      public userId: number,
      public habitName:string,
      public deleted:false 

      ) { }
  }