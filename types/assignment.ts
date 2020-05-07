export class Assignment {
    readonly id : number; // assignment ID
    readonly uid : number; // user id
    public classId : number; // class

    public name : string; // name of assignment
    public note : string; // info about assignment

    public due : number; // due date, UTC
    public ttc : number; // some date

    constructor(id : number, uid : number, name : string, classId : number, due : number, note : string, ttc : number){
        this.id = id;
        this.uid = uid;
        this.classId = classId;

        this.name = name;
        this.note = note;

        this.due = due;
        this.ttc = ttc;
    }

    public async objectify() : Promise<any> {
      return {
        id: this.id,
        uid: this.uid,
        class: this.classId,

        name: this.name,
        note: this.note,

        due: this.due,
        ttc: this.ttc
      };
    }
}
