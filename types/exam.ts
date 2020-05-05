export class Exam {

  readonly id : number;
  readonly uid : number;
  public name : string;
  public calendarData : object;

  public Exam(id : number, uid : number, name : string, calendarData : object) {
    this.id = id;
    this.uid = uid;
    this.name = name;
    this.calendarData = calendarData;
  }

  public objectify() : object {
    return {
      id: id,
      uid: uid,
      name: name,
      calendarData: calendarData
    }
  }
}
