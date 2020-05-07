export class Assignment {
    readonly id : number; // assignment ID
    readonly uid : number; // user id
    public courseId : number; // class

    public name : string; // name of assignment
    public note : string; // info about assignment

    public due : number; // due date, UTC
    public ttc : number; // some date

    constructor(id : number, uid : number, name : string, courseId : number, due : number, note : string, ttc : number){
        this.id = id;
        this.uid = uid;
        this.courseId = courseId;

        this.name = name;
        this.note = note;

        this.due = due;
        this.ttc = ttc;
    }

    public async objectify() : Promise<any> {
      return {
        id: this.id,
        uid: this.uid,
        course: this.courseId,

        name: this.name,
        note: this.note,

        due: this.due,
        ttc: this.ttc
      };
    }
}
