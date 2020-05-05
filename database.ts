import { User } from './types/user'
import { Exam } from './types/exam'
import { Extracurricular } from './types/extracurricular';
import { Assignment } from './types/assignment';

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

  // Users

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

  public async getUserByName(username : string) : Promise<User | null> {
    if (!username) return null;

    let db = this.client.db(this.dbName);
    let collection = db.collection('users');

    try {
      let res = await collection.findOne(
        {
          username: username,
        }
      );

      let user : User = new User(res.id, res.username, res.hash);

      return user;
    } catch (e) {
      return null;
    }
  }

  // Exams

  private async getNextExamId() : Promise<number> {
    let id = await this.getSequenceNextValue('exams')
    return id;
  }

  public async createExam(uid : number, name : string, calendarData : object) : Promise<Exam> {
    let id = await this.getNextExamId();

    let exam : Exam = new Exam(id, uid, name, calendarData)
    await this.putExam(exam);

    return exam;
  }

  public async putExam(exam : Exam) : Promise<void> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('exams');

    let res = await collection.updateOne(
      {
        id: exam.id,
      },
      {
        $set : exam
      },
      {
        upsert: true
      }
    );
  }

  public async getExam(id : number) : Promise<Exam> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('exams');

    let res = await collection.findOne(
      {
        id: id,
      }
    );

    let exam : Exam = new Exam(res.id, res.uid, res.name, res.calendarData)

    return exam;
  }

  public async getExamsForUser(uid : number) : Promise<Exam[] | null> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('exams');

    try {
      let results = await collection.findMany(
        {
          uid: uid,
        }
      );

      let exams = []

      for (let res of results) {
        let exam : Exam = new Exam(res.id, res.uid, res.name, res.calendarData)
        exams.push(exam)
      }

      return exams;
    } catch (e) {
      return [];
    }
  }



  // EXTRACURRICULARS

  private async getNextECId() : Promise<number> {
    let id = await this.getSequenceNextValue('extracurriculars')
    return id;
  }

  public async createEC(uid : number, name : string, calendarData : object[], note : string) : Promise<Extracurricular> {
    let id = await this.getNextECId();

    let ec : Extracurricular = new Extracurricular(calendarData, name,note, id, uid);
    await this.putEC(ec);

    return ec;
  }

  public async putEC(ec : Extracurricular) : Promise<void> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('extracurriculars');

    let res = await collection.updateOne(
      {
        id: ec.id,
      },
      {
        $set : ec
      },
      {
        upsert: true
      }
    );
  }

  public async getEC(id : number) : Promise<Extracurricular> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('extracurriculars');

    let res = await collection.findOne(
      {
        id: id,
      }
    );

    let ec : Extracurricular = new Extracurricular(res.times, res.name, res.note, res.uid, res.id);

    return ec;
  }

  public async getECForUser(uid : number) : Promise<Extracurricular[] | null> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('extracurriculars');

    try {
      let results = await collection.findMany(
        {
          uid: uid,
        }
      );

      let extracurriculars = []

      for (let res of results) {
        let ec : Extracurricular = new Extracurricular(res.times, res.name, res.note, res.uid, res.id);
        extracurriculars.push(ec)
      }

      return extracurriculars;
    } catch (e) {
      return [];
    }
  }

  // ASSIGNMENTS
  private async getNextAssignmentId() : Promise<number> {
    let id = await this.getSequenceNextValue('assignments')
    return id;
  }

  public async createAssignment(name : string, uid : number, classID : number, date : number, note : string) : Promise<Assignment> {
    let id = await this.getNextECId();

    let ass : Assignment = new Assignment(name, id, classID, note, date, uid);
    await this.putAssignment(ass);

    return ass;
  }

  public async putAssignment(ass : Assignment) : Promise<void> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('assignments');

    let res = await collection.updateOne(
      {
        id: ass.id,
      },
      {
        $set : ass
      },
      {
        upsert: true
      }
    );
  }

  public async getAss(id : number) : Promise<Assignment> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('assignments');

    let res = await collection.findOne(
      {
        id: id,
      }
    );

    let ass : Assignment = new Assignment(res.assignmentName, res.assignmentID, res.course, res.notes, res.timeToComplete, res.uid);

    return ass;
  }

  public async getAssignmentForUser(uid : number) : Promise<Assignment[] | null> {
    let db = this.client.db(this.dbName);
    let collection = db.collection('assignments');

    try {
      let results = await collection.findMany(
        {
          uid: uid,
        }
      );

      let assignments = []

      for (let res of results) {
        let ass : Assignment = new Assignment(res.assignmentName, res.assignmentID, res.course, res.notes, res.timeToComplete, res.uid);
        assignments.push(ass)
      }

      return assignments;
    } catch (e) {
      return [];
    }
  }
  
}
