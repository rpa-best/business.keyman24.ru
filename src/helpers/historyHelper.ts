import { IInventoryHistory } from 'http/types';

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

export const getBarData = (cloneHistory: cloneHistory[]) => {
    const barLabels = [];
    const barData = [];

    for (const item of cloneHistory) {
        if (item.mode) {
            const passed = cloneHistory.find((i) => i.id === item.id + 1);
            const date = item.date.getTime();
            const passedDate = passed ? passed.date.getTime() : Date.now();
            const differenceInHours = (passedDate - date) / 1000 / 3600;
            barLabels.push(item.worker.user.username);
            barData.push(+differenceInHours.toFixed(4));
        }
    }
    return { barLabels, barData };
};

export const getOrgBarData = (cloneHistory: cloneHistory[]) => {
    const orgs: { org: string; hours: number }[] = [];

    for (const item of cloneHistory) {
        if (item.mode) {
            const passed = cloneHistory.find((i) => i.id === item.id + 1);
            const date = item.date.getTime();
            const passedDate = passed ? passed.date.getTime() : Date.now();
            const differenceInHours = (passedDate - date) / 1000 / 3600;

            orgs.push({
                org: item.worker.org.name,
                hours: differenceInHours,
            });
        }
    }

    interface SummarizedData {
        org: string;
        hours: number;
    }

    const result: SummarizedData[] = [];

    orgs.reduce((acc, current) => {
        const item = acc.find((i) => i.org === current.org);
        if (item) {
            item.hours += current.hours;
        } else {
            acc.push({ org: current.org, hours: current.hours });
        }
        return acc;
    }, result);

    const labels = result.map((r) => {
        return r.org;
    });
    const data = result.map((r) => {
        return r.hours;
    });

    return { labels, data };
};
