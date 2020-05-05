export class Exam {

  readonly id : number;
  readonly uid : number;
  public name : string;
  public calendarData : object;

  constructor(id : number, uid : number, name : string, calendarData : object) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.calendarData = calendarData;
  }

  public objectify() : object {
    return {
      id: this.id,
      uid: this.uid,
      name: this.name,
      calendarData: this.calendarData
    }
  }
}
