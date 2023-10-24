import { IInventoryHistory } from 'http/types';
import { getObjValue } from 'utils/getObjProperty';

export const formatDateHistory = (keyHistory: IInventoryHistory[]) => {
    return keyHistory.map((h) => {
        const dateString = h.date;
        const parts = dateString.split(' ');
        const datePart = parts[0].split('.');
        const timePart = parts[1].split(':');
        const year = parseInt(datePart[2], 10);
        const month = parseInt(datePart[1], 10) - 1;
        const day = parseInt(datePart[0], 10);
        const hours = parseInt(timePart[0], 10);
        const minutes = parseInt(timePart[1], 10);
        const seconds = parseInt(timePart[2], 10);
        const date = new Date(year, month, day, hours, minutes, seconds);
        /* const date = new Date(
            `${h.date.slice(3, 5)}.${h.date.slice(0, 2)}.${h.date.slice(6)}`
        );*/
        return {
            ...h,
            date: date,
        };
    });
};

interface cloneHistory extends Omit<IInventoryHistory, 'date'> {
    date: Date;
}

//item.worker.user.fullname

export const getBarGroupData = (
    cloneHistory: cloneHistory[],
    unitPath: string
): [string[], number[]] => {
    const units: { unit: string; hours: number }[] = [];

    cloneHistory.forEach((item, index) => {
        const passed = cloneHistory[index - 1];
        if (item.mode) {
            let pasDate;
            if (passed) {
                pasDate = passed.date.getTime();
            } else {
                const timestamp = Date.now();
                const dateFormatter = new Intl.DateTimeFormat('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                const formattedDateStr = dateFormatter.format(
                    new Date(timestamp)
                );

                const date = formattedDateStr.slice(0, 10).split('.');
                const time = formattedDateStr.slice(12).split(':');

                const year = +date[2];
                const month = +date[1] - 1;
                const day = +date[0];
                const hours = +time[0];
                const minutes = +time[1];
                const seconds = +time[2];

                pasDate = new Date(
                    year,
                    month,
                    day,
                    hours,
                    minutes,
                    seconds
                ).getTime();
            }

            const date = item.date.getTime();
            const passedDate = pasDate;
            const difference = passedDate - date;
            const secondsDifference = difference / 1000;
            const minutesDifference = secondsDifference / 60;
            const hoursDifference = minutesDifference / 60;

            units.push({
                unit: getObjValue(item, unitPath),
                hours: +hoursDifference.toFixed(1),
            });
        }
    });

    interface SummarizedData {
        unit: string;
        hours: number;
    }

    const result: SummarizedData[] = [];

    units.reduce((acc, current) => {
        const item = acc.find((i) => i.unit === current.unit);
        if (item) {
            item.hours += current.hours;
        } else {
            acc.push({ unit: current.unit, hours: current.hours });
        }
        return acc;
    }, result);

    const barLabels = result.map((r) => {
        return r.unit;
    });
    const barData = result.map((r) => {
        return r.hours;
    });

    return [barLabels, barData];
};
