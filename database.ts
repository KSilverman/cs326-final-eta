export class Database {
  private MongoClient = require('mongodb').MongoClient;

  constructor() {

  }

  public async connect(url: string) : Promise<void> {
    return new Promise((resolve, reject) => {

        resolve();
        return;

        // this comes once we're actually gonna use a DB
        this.MongoClient.connect(url, function(err, db) {
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
}
