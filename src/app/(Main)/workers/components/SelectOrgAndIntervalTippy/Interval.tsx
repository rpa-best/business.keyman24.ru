import React, { useContext, useEffect, useState } from 'react';
import { RangePicker } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/RangePicker';

import scss from './SelectOrgAndIntervalTippy.module.scss';
import {
    CalendarContext,
    CalendarType,
} from 'app/(Main)/workers/components/WorkersButton/WorkersButton';
import { TableContext } from 'components/Table/Table';

interface IntervalProps {
    setDates: React.Dispatch<
        React.SetStateAction<{ from?: string; to?: string } | null>
    >;
    refresh: boolean;
}

export const Interval: React.FC<IntervalProps> = ({ setDates, refresh }) => {
    const { setCalendarOpen } = useContext<CalendarType | null>(
        CalendarContext
    ) as CalendarType;
    const [currentInterval, setCurrentInterval] = useState<'month' | 'day'>(
        'day'
    );

    const onCalendarOpen = () => {
        setCalendarOpen(true);
    };
    const onCalendarClose = () => {
        setCalendarOpen(false);
    };

    useEffect(() => {
        setCurrentInterval('day');
    }, [refresh]);

    return (
        <div className={scss.interval_wrapper}>
            <button
                onClick={() => {
                    setCurrentInterval('day');
                }}
                className={
                    currentInterval === 'day'
                        ? scss.interval_button_active
                        : scss.interval_button
                }
            >
                По дням
            </button>
            <button
                onClick={() => {
                    setCurrentInterval('month');
                }}
                className={
                    currentInterval === 'month'
                        ? scss.interval_button_active
                        : scss.interval_button
                }
            >
                По месяцам
            </button>
            {currentInterval === 'day' && (
                <RangePicker
                    onCalendarOpen={onCalendarOpen}
                    onCalendarClose={onCalendarClose}
                    refresh={refresh}
                    maxDate={new Date()}
                    setDates={setDates}
                />
            )}
            {currentInterval === 'month' && (
                <RangePicker
                    maxDate={new Date()}
                    onCalendarClose={onCalendarClose}
                    onCalendarOpen={onCalendarOpen}
                    refresh={refresh}
                    setDates={setDates}
                    selectMonth={true}
                />
            )}
        </div>
    );
};
