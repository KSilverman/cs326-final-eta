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
        this.init();
        console.log("Database connected.");
        // db.close();
        resolve();
      });

    });
  }

  private async init() : Promise<void> {
    let db = this.client.db(this.dbName);
    let collections = ["users"];
    for (var collectionName of collections) {
      var seqDoc = await db.collection(collectionName).findOneAndUpdate(
        {
          _id: 'sequence'
        },
        {
          $setOnInsert: {seqValue: 0},
        },
        {
          upsert: true,
        }
      );
    }
  }

  private async getSequenceNextValue(collectionName : string) : Promise<number> {
    let db = this.client.db(this.dbName);
    var seqDoc = await db.collection(collectionName).findOneAndUpdate(
      {
        _id: 'sequence'
      },
      {
        $inc: { seqValue: 1 },
      },
      {
        new: true
      }
    );
    
    return seqDoc.value.seqValue;
  }

  private async getNextUserId() : Promise<number> {
    let id = await this.getSequenceNextValue('users')
    return id;
  }

  public async createUser(username : string, hash : string) : Promise<User> {
    let id = await this.getNextUserId();

    let user : User = new User(id, username, hash);
    await this.putUser(user);

    return user;
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
