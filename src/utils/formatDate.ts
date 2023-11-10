import { setHours } from 'date-fns';

export function formatDate(d: Date, type?: 'lg' | 'gt') {
    let newD = d;
    if (type) {
        newD = setHours(d, type === 'lg' ? 23 : 0);
    }
    let month = '' + (newD.getMonth() + 1);
    let day = '' + newD.getDate();
    const year = newD.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
