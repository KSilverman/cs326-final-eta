// the course class

export class Course {
  readonly uid : number;
  readonly id : number;
  public title : string;
  public calendarData : object
  public discussionCalendarData : object

  constructor(id : number, uid : number, title : string, calendarData : object, discussionCalendarData : object) {
    this.id = id;
    this.uid = uid;
    this.title = title;
    this.calendarData = calendarData;
    this.discussionCalendarData = discussionCalendarData;
  }

  public objectify() {
    return {
      id: this.id,
      uid: this.uid,
      title: this.title,
      calendarData: this.calendarData,
      discussionCalendarData: this.discussionCalendarData
    }
  }
}
