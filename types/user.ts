const bcrypt = require('bcrypt')

export class User {
  readonly id : number;
  public username : string;
  private hash : string;

  private static saltRounds : number = 10;

  constructor(id: number, username: string, hash: string) {
    this.id = id;
    this.username = username;
    this.hash = hash;
  }

  public static async createHash(password : string) : Promise<string> {
    let hash : string = await new Promise((resolve : any, reject : any) => {
      bcrypt.hash(password, User.saltRounds, (err : any, hash : string) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      })
    });

    return hash;
  }

  public async checkHash(password : string) : Promise<boolean> {
    let match : any = new Promise((resolve : any, reject : any) => {
      bcrypt.compare(password, this.hash, (err : any, res : boolean) => {
        if (err) reject(err);

        resolve(res);
      })
    });

    return match as boolean;
  }

  public objectify() : object {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
