'use client';

import React, { useEffect, useState } from 'react';

import { FiltersContainer } from 'app/(Main)/components/FiltersContainer';
import { LineChart } from 'app/(Main)/components/LineChart';
import { IOrganization } from 'store/types';
import {
    QueryIntervalType,
    QueryModeType,
} from 'app/(Main)/components/LineChart/LineChart';
import { ILocation, LineChartData } from 'http/types';
import StatisticsSvg from './svg/statistics.svg';
import { useSearchParams } from 'next/navigation';

import scss from './FiltersAndLineChart.module.scss';

interface FiltersAndLineChartProps {
    allOrgs: IOrganization[];
    org: IOrganization;
    lineChartData: LineChartData;
    locations: ILocation[];
}

export const FiltersAndLineChart: React.FC<FiltersAndLineChartProps> = ({
    lineChartData,
    allOrgs,
    locations,
    org,
}) => {
    const query = useSearchParams();

    const queryInterval = query.get('interval');
    const queryMode = query.get('mode');

    const [mode, setMode] = useState<QueryModeType[]>(
        (queryMode?.split(',') as QueryModeType[]) ?? ['uniqueCount']
    );
    const [interval, setInterval] = useState<QueryIntervalType>(
        (queryInterval as QueryIntervalType) ?? 'byDay'
    );

    const handleChangeQuery = (m?: QueryModeType[], i?: QueryIntervalType) => {
        if (m) {
            setMode(m);
        }
        if (i) {
            setInterval(i);
        }
    };

    useEffect(() => {
        if (!queryMode) {
            setMode(['uniqueCount']);
        }
    }, [queryMode]);

    useEffect(() => {
        if (!queryInterval) {
            setInterval('byDay');
        }
    }, [queryInterval]);

    return (
        <>
            <FiltersContainer
                locations={locations}
                interval={interval}
                handleChangeQuery={handleChangeQuery}
                contractors={allOrgs}
                org={org}
            />
            <div className={scss.line_chart_wrapper}>
                <div className={scss.line_chart_title}>
                    <StatisticsSvg className={scss.svg} />
                    <h2>Статистика</h2>
                </div>

                <LineChart
                    mode={mode}
                    interval={interval}
                    chartData={lineChartData}
                />
            </div>
        </>
    );
};
