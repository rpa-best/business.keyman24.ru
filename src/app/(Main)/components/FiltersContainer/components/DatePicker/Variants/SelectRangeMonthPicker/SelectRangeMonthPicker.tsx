import { formatDate } from 'utils/formatDate';
import { RangeDatePicker } from 'components/RangeDatePicker';
import React, { useMemo } from 'react';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getMonth, setDate, setMonth } from 'date-fns';

export const SelectRangeMonthPicker = () => {
    const query = useSearchParams();
    const router = useRouter();
    const queryHelper = new SearchParamsHelper(query.entries);
    const pathname = usePathname();

    const start = query.get('date_gt');

    const end = query.get('date_lt');

    const startQuery = useMemo(() => {
        return start
            ? new Date(start)
            : setDate(setMonth(Date.now(), getMonth(Date.now()) - 6), 1);
    }, [start]);

    const endQuery = useMemo(() => {
        return end ? new Date(end) : new Date();
    }, [end]);

    const handleChangeDate = (d: Date, query: string) => {
        if (!d) {
            queryHelper.getParams.delete(query);
            router.replace(pathname + `?${queryHelper.getParams}`);
            return;
        }
        queryHelper.set(query, formatDate(d));
        router.replace(pathname + `?${queryHelper.getParams}`, {
            scroll: false,
        });
    };

    return (
        <RangeDatePicker
            selectMonth
            start={startQuery}
            end={endQuery}
            setStart={(d) => {
                handleChangeDate(d, 'date_gt');
            }}
            setEnd={(d) => {
                handleChangeDate(d, 'date_lt');
            }}
        />
    );
};
