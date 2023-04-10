export class Habit {

    constructor(
      public id:string,
      public userId:string,
      public habitName:string,
      public creationDate:string, 
      public deleted:boolean

      ) {}
}