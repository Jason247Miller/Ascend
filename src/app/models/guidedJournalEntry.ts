export class IGuidedJournalEntry {

    constructor(
public id: number, 
public userId: number, 
public date:string,
public entryName:string,
public entryValue: string, 
public deleted: false

) { }
}
