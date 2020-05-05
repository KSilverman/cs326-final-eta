export class Assignment {
    private id : number; // assignment ID
    private name : string; // name of assignment
    private class : number; // class
    private note : string; // info about assignment
    private ttc : number; // some date 
    
    constructor(assName: string, assID: number,  classID: number, info: string, date: number){
        this.id = assID;
        this.name = assName;
        this.class = classID;
        this.note = info;
        this.ttc = date;
    }
  
    public async objectify() : Promise<any> {
        return {
            'assingmentID' : this.id,
            'assignmentName': this.name,
            'assignmentClass': this.class,
            'expected TTC': this.ttc,
            'notes': this.note
        };
      }
}
