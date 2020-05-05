export class Assignment {
    readonly id : number; // assignment ID
    readonly name : string; // name of assignment
    readonly class : number; // class
    readonly note : string; // info about assignment
    readonly ttc : number; // some date 
    readonly uid : number; // user id
    
    constructor(assName: string, assID: number,  classID: number, info: string, date: number, uid: number){
        this.id = assID;
        this.name = assName;
        this.class = classID;
        this.note = info;
        this.ttc = date;
        this.uid = uid;
    }
  
    public async objectify() : Promise<any> {
        return {
            'assingmentID' : this.id,
            'assignmentName': this.name,
            'course': this.class,
            'timeToComplete': this.ttc,
            'notes': this.note,
            'uid': this.uid
        };
      }
}
