export class Habit {

    constructor(
      public id: number,
      public userId: number,
      public habitName:string,
      public uuid:string, 
      public deleted:boolean

      ) { }
  }