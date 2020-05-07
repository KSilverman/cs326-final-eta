// the course class

export class Course {
  readonly uid : number;
  readonly id : number;
  public title : string;
  public calendarData : object[]

  constructor(id : number, uid : number, title : string, calendarData : object[]) {
    this.id = id;
    this.uid = uid;
    this.title = title;
    this.calendarData = calendarData;
  }

  public objectify() {
    return {
      id: this.id,
      uid: this.uid,
      title: this.title,
      calendarData: this.calendarData
    }
  }
}
