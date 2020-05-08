export class Extracurricular {
    public calData : object[]; // Calendar data
    public name : string; // What it is
    public note : string; // Extra info 
    readonly uid : number; // User ID
    readonly id : number; // Unique EC ID
    
    constructor(cal : object[], name : string, note : string, uid: number, id : number){
        this.calData = cal;
        this.name = name;
        this.note = note;
        this.uid = uid;
        this.id = id;
    }

    public objectify() : object{
        return {
          'name': this.name,
          'id': this.id,
          'times': JSON.stringify(this.calData),
          'note': this.note,
          'uid': this.uid
        };
      }
}
