export class DateHelper {
    constructor(private date: string) {}

    /*private Date = new Date(this.date);*/

    get getDate() {
        return this.date.slice(0, 5);
    }

    get getTime() {
        return this.date.slice(11, 16);
    }
}
