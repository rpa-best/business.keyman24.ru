'use client';

import React from 'react';
import 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { LineChartData } from 'http/types';
import { useSearchParams } from 'next/navigation';
import { Line } from 'react-chartjs-2';

import scss from './LineChart.module.scss';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

interface LineChartProps {
    chartData: LineChartData;
}

type QueryIntervalType = 'byHour' | 'byWeek' | 'byMonth' | 'byDay';
type QueryModeType = 'true' | 'false' | undefined;

export const LineChart: React.FC<LineChartProps> = ({ chartData }) => {
    const query = useSearchParams();

    const interval = (query.get('interval') as QueryIntervalType) ?? 'byHour';
    const mode = query.get('interval') as QueryModeType;

    const intervalQuery =
        interval === 'byHour'
            ? 'По часам'
            : interval === 'byWeek'
            ? 'По неделям'
            : interval === 'byMonth'
            ? 'По месяцам'
            : 'По дням';

    const modeQuery =
        mode === 'true'
            ? 'entersCount'
            : mode === 'false'
            ? 'exitCount'
            : 'uniqueCount';

    const labels = Object.keys(chartData[interval]);

    const dataSet: ChartData<'line'> = {
        labels: labels,
        datasets: [
            {
                label: intervalQuery,
                data: Object.values(chartData[interval]).map(
                    (el) => el[modeQuery]
                ),
            },
        ],
    };

    return <Line className={scss.line_chart_wrapper} data={dataSet} />;
};
