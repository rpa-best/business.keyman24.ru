import React, { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { formatDate } from 'utils/formatDate';
import { RangeDatePicker } from 'components/RangeDatePicker/RangeDatePicker';

export const SelectRangePicker = ({ showWeek }: { showWeek?: boolean }) => {
    const pathname = usePathname();
    const router = useRouter();
    const query = useSearchParams();
    const queryHelper = new SearchParamsHelper(query.entries);

    const start = query.get('date_gt');

    const startQuery = useMemo(() => {
        const difference = showWeek ? +2 : +1;
        return start
            ? new Date(start)
            : new Date(new Date().setMonth(new Date().getMonth() - difference));
    }, [start]);

    const end = query.get('date_lt');

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
            start={startQuery}
            end={endQuery}
            setStart={(d) => {
                handleChangeDate(d, 'date_gt');
            }}
            showWeek={showWeek}
            setEnd={(d) => {
                handleChangeDate(d, 'date_lt');
            }}
        />
    );
};
