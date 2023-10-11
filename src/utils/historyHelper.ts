import { IInventoryHistory } from 'http/types';
import { getObjValue } from 'utils/getObjProperty';

export const formatDateHistory = (keyHistory: IInventoryHistory[]) => {
    return keyHistory.map((h) => {
        const date = new Date(
            `${h.date.slice(3, 5)}.${h.date.slice(0, 2)}.${h.date.slice(6)}`
        );
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

    for (const item of cloneHistory) {
        if (item.mode) {
            const passed = cloneHistory.find((i) => i.id === item.id + 1);
            const date = item.date.getTime();
            const passedDate = passed ? passed.date.getTime() : Date.now();
            const differenceInHours = (passedDate - date) / 1000 / 3600;

            units.push({
                unit: getObjValue(item, unitPath),
                hours: differenceInHours,
            });
        }
    }

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
