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
    interval: QueryIntervalType;
    mode: QueryModeType;
}

export type QueryIntervalType = 'byHour' | 'byWeek' | 'byMonth' | 'byDay';
export type QueryModeType = 'uniqueCount' | 'exitCount' | 'entersCount';

export const LineChart: React.FC<LineChartProps> = ({
    chartData,
    interval,
    mode,
}) => {
    const modeDesc =
        mode === 'uniqueCount'
            ? 'Уникальные посещения'
            : mode === 'entersCount'
            ? 'Входы'
            : 'Выходы';

    const labels = Object.keys(chartData[interval]);

    const dataSet: ChartData<'line'> = {
        labels: labels,
        datasets: [
            {
                label: modeDesc,
                data: Object.values(chartData[interval]).map((el) => el[mode]),
            },
        ],
    };

    return <Line className={scss.line_chart_wrapper} data={dataSet} />;
};
