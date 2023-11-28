import React, { useEffect, useState } from 'react';
import { RangePicker } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/RangePicker';

import scss from './SelectOrgAndIntervalTippy.module.scss';

interface IntervalProps {
    setDates: React.Dispatch<
        React.SetStateAction<{ from?: string; to?: string } | null>
    >;
    refresh: boolean;
}

export const Interval: React.FC<IntervalProps> = ({ setDates, refresh }) => {
    const [currentInterval, setCurrentInterval] = useState<'month' | 'day'>(
        'day'
    );

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
                <RangePicker refresh={refresh} setDates={setDates} />
            )}
            {currentInterval === 'month' && (
                <RangePicker
                    refresh={refresh}
                    setDates={setDates}
                    selectMonth={true}
                />
            )}
        </div>
    );
};
