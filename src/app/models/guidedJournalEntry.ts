export class IGuidedJournalEntry {

    constructor(
public id: number, 
public userId: number, 
public date:string,
public gratitudeEntry:string,
public highlightEntry: string, 
public learnedEntry: string,
public contributeEntry: string,
public generalEntry:string,
) { }
}
