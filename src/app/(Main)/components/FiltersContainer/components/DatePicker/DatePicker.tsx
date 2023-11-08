import React from 'react';
import { useSearchParams } from 'next/navigation';

import scss from 'app/(Main)/components/FiltersContainer/FilterContainer.module.scss';
import { SingleDayPicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker/Variants/SingleDayPicker/SingleDayPicker';
import { SelectRangePicker } from 'app/(Main)/components/FiltersContainer/components/DatePicker/Variants/SelectRangePicker/SelectRangePicker';

export const DatePicker = () => {
    const query = useSearchParams();

    const currentInterval = query.get('interval') ?? 'byHour';

    return (
        <div className={scss.date_filter}>
            {currentInterval === 'byHour' && <SingleDayPicker />}
            {currentInterval === 'byDay' && <SelectRangePicker />}
        </div>
    );
};
