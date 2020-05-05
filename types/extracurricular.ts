export class Extracurricular {
    readonly calData : object[]; // Calendar data
    readonly name : string; // What it is
    readonly note : string; // Extra info 
    readonly uid : number; // User ID
    readonly id : number; // Unique EC ID
    
    constructor(cal : object[], name : string, note : string, uid: number, id : number){
        this.calData = cal;
        this.name = name;
        this.note = note;
        this.uid = uid;
        this.id = id;
    }

    public async objectify() : Promise<any> {
        return {
          'name': this.name,
          'id': this.id,
          'times': JSON.stringify(this.calData),
          'note': this.note,
          'uid': this.uid
        };
      }
}
