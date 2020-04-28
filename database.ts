import { User } from './types/user'

export class Database {
  private MongoClient = require('mongodb').MongoClient;
  private client : any;
  private db : any;
  private dbName : string = 'eta';

  constructor() {

  }

  public async connect(url: string) : Promise<void> {
    return new Promise((resolve, reject) => {

      this.client = new this.MongoClient(url);

      // this comes once we're actually gonna use a DB
      this.client.connect((err : any, db : any) => {
        this.db = db;
        if (err) {
          reject(err);
          return;
        }
        console.log("Database created!");
        // db.close();
        resolve();
      });

    });
  }

  public async putUser(user : User) : Promise<void> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('users');

    let res = await collection.updateOne(
      {
        id: user.id,
      },
      {
        $set : user
      },
      {
        upsert: true
      }
    );

    console.log('Put user id ' + user.id);
  }

  public async getUser(id : number) : Promise<User> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('users');

    let res = await collection.findOne(
      {
        id: id,
      }
    );

    let user : User = new User(res.id, res.username, res.hash);

	  return user;
  }
}
