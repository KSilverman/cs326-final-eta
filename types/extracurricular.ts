export class Extracurricular {
    readonly uid : number; // User ID
    readonly id : number; // Unique EC ID
    public name : string; // What it is
    public calendarData : object;

    constructor(id : number, uid : number, name : string, calendarData : object){
        this.calendarData = calendarData;
        this.name = name;
        this.uid = uid;
        this.id = id;
    }

    public objectify() : object {
      return {
        id: this.id,
        uid: this.uid,

        name: this.name,
        calendarData: this.calendarData
      };
    }
}
