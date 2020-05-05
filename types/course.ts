// the course class

export class Course {
  private uid : number;
  private id : number;
  private title : string;
  private calendarData : object[]

  constructor(id : number, uid : number, title : string, calendarData : object[]) {
    this.id = id;
    this.uid = uid;
    this.title = title;
    this.calendarData = calendarData;
  }

  public objectify() {
    return {
      id: this.id,
      uid: thid.uid,
      title: this.title,
      calendarData: this.calendarData
    }
  }
}
