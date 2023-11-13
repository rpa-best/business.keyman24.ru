import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { SearchParamsHelper } from 'utils/searchParamsHelper';

import { SingleDayPicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker/Variants/SingleDayPicker/SingleDayPicker';
import { SelectRangePicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker/Variants/SelectRangePicker/SelectRangePicker';
import { SelectRangeMonthPicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker/Variants/SelectRangeMonthPicker';

import scss from 'app/(Main)/components/FiltersContainer/FilterContainer.module.scss';

interface DatePickerProps {
    currentInterval: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ currentInterval }) => {
    const query = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const queryHelper = new SearchParamsHelper(query.entries);

    useEffect(() => {
        queryHelper.set('interval', 'byHour');
        router.prefetch(pathname + `?${queryHelper.getParams}`);
    }, [query]);

    useEffect(() => {
        queryHelper.set('interval', 'byMonth');
        router.prefetch(pathname + `?${queryHelper.getParams}`);
    }, [query]);

    return (
        <div className={scss.date_filter}>
            {currentInterval === 'byHour' && <SingleDayPicker />}
            {currentInterval === 'byDay' && <SelectRangePicker />}
            {currentInterval === 'byWeek' && (
                <SelectRangePicker showWeek={true} />
            )}
            {currentInterval === 'byMonth' && <SelectRangeMonthPicker />}
        </div>
    );
};
