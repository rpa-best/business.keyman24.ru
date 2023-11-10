'use client';

import React, { useEffect, useState } from 'react';

import { FiltersContainer } from 'app/(Main)/components/FiltersContainer';
import { LineChart } from 'app/(Main)/components/LineChart';
import { IOrganization } from 'store/types';
import {
    QueryIntervalType,
    QueryModeType,
} from 'app/(Main)/components/LineChart/LineChart';
import { LineChartData } from 'http/types';
import { useSearchParams } from 'next/navigation';

interface FiltersAndLineChartProps {
    allOrgs: IOrganization[];
    org: IOrganization;
    lineChartData: LineChartData;
}

export const FiltersAndLineChart: React.FC<FiltersAndLineChartProps> = ({
    lineChartData,
    allOrgs,
    org,
}) => {
    const query = useSearchParams();

    const queryInterval = query.get('interval');
    const queryMode = query.get('mode');

    const [mode, setMode] = useState<QueryModeType>(
        (queryMode as QueryModeType) ?? 'uniqueCount'
    );
    const [interval, setInterval] = useState<QueryIntervalType>(
        (queryInterval as QueryIntervalType) ?? 'byDay'
    );

    const handleChangeQuery = (m?: QueryModeType, i?: QueryIntervalType) => {
        if (m) {
            setMode(m);
        }
        if (i) {
            setInterval(i);
        }
    };

    useEffect(() => {
        if (!queryMode) {
            setMode('uniqueCount');
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
                interval={interval}
                handleChangeQuery={handleChangeQuery}
                contractors={allOrgs}
                org={org}
            />
            <LineChart
                mode={mode}
                interval={interval}
                chartData={lineChartData}
            />
        </>
    );
};