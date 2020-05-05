export class Extracurricular {
    private calData : object[]; // Calendar data
    private name : string; // What it is
    private note : string; // Extra info 
    private uid : number; // User ID
    
    constructor(cal : object[], name : string, note : string, uid: number){
        this.calData = cal;
        this.name = name;
        this.note = note;
        this.uid = uid;
    }

    public async objectify() : Promise<any> {
        return {
          'name': this.name,
          'times': JSON.stringify(this.calData),
          'note': this.note,
          'uid': this.uid
        };
      }
}
