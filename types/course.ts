// the course class

export class Course {
  private uid : number;
  private id : number;
  private title : string;

  constructor(uid : number, id : number, title : string) {
    this.uid = uid;
    this.id = id;
    this.title = title;
  }
}
