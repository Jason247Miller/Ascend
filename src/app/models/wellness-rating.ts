export class WellnessRating {

    constructor(
      public id: 0 | number,
      public userID: number,
      public date:string,
      public sleepRating:number,
      public exerciseRating:number,
      public nutritionRating:number,
      public stressRating:number,
      public sunlightRating:number,
      public mindfulnessRating:number,
      public productivityRating:number,
      public moodRating:number,
      public energyRating:number
      ) { }
  }