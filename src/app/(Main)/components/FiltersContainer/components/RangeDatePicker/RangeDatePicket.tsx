import { PickDate } from 'components/PickDate';
import React, { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParamsHelper } from 'utils/searchParamsHelper';
import { formatDate } from 'utils/formatDate';

export const RangeDatePicket = () => {
    const pathname = usePathname();
    const router = useRouter();
    const query = useSearchParams();
    const queryHelper = new SearchParamsHelper(query.entries);

    const start = query.get('date_it');

    const startQuery = useMemo(() => {
        return start ? new Date(start) : new Date();
    }, [start]);

    const end = query.get('date_gt');

    const endQuery = useMemo(() => {
        return end
            ? new Date(end)
            : new Date(new Date().setMonth(new Date().getMonth() + 1));
    }, [end]);

    const handleChangeDate = (d: Date, query: string) => {
        if (!d) {
            queryHelper.getParams.delete(query);
            router.replace(pathname + `?${queryHelper.getParams}`);
            return;
        }
        queryHelper.set(query, formatDate(d));
        router.replace(pathname + `?${queryHelper.getParams}`);
    };
    return (
        <PickDate
            start={startQuery}
            end={endQuery}
            setStart={(d) => {
                handleChangeDate(d, 'date_it');
            }}
            setEnd={(d) => {
                handleChangeDate(d, 'date_gt');
            }}
        />
    );
};
