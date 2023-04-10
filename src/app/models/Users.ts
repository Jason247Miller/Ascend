export class User {

    constructor(
      public id = '',
      public firstName = '',
      public lastName = '',
      public email = '',
      public password = '',
      public jwtToken?: string
      ) { }
  }
  