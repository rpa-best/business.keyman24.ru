'use client';

import React, { useMemo } from 'react';
import 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { LineChartData } from 'http/types';
import { Line } from 'react-chartjs-2';
import { FilterData } from 'app/(Main)/components/FiltersContainer/components/InputFiltersWrapper/data';
import { getGradient } from 'app/(Main)/components/LineChart/utils';

import scss from './LineChart.module.scss';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

interface LineChartProps {
    chartData: LineChartData;
    interval: QueryIntervalType;
    mode: QueryModeType[];
}

export type QueryIntervalType = 'byHour' | 'byMonth' | 'byDay';
export type QueryModeType = 'uniqueCount' | 'exitCount' | 'entersCount';

export const options: ChartOptions<'line'> = {
    color: 'rgba(255, 255, 255)',
    backgroundColor: '#31D79B',
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
        x: {
            grid: {
                color: 'white',
            },
        },
    },
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            backgroundColor: 'white',
            titleColor: 'black',
            bodyColor: 'black',
            borderColor: 'rgba(233, 233, 233, 1)',
            borderWidth: 2,
            padding: 10,
        },
    },
    interaction: {
        intersect: false,
    },
};

const colors = [
    {
        first: 'rgba(49, 215, 155, .5)',
        second: 'rgba(49, 215, 155, .3)',
        border: '#31D79B',
    },
    {
        first: 'rgba(81, 111, 165, .5)',
        second: 'rgba(81, 111, 165, .3)',
        border: 'rgba(81, 111, 165, 1)',
    },
    {
        first: 'rgba(194, 64, 64, .5)',
        second: 'rgba(194, 64, 64, .3)',
        border: 'rgba(194, 64, 64, 1)',
    },
];

export const LineChart: React.FC<LineChartProps> = ({
    chartData,
    interval,
    mode,
}) => {
    const modeDesc = FilterData.filter((el) =>
        mode.some((m) => el.query === m)
    );

    const labels = useMemo(() => {
        return interval === 'byMonth'
            ? Object.keys(chartData[interval]).map((el) =>
                  el.slice(2, 7).split('-').reverse().join('.')
              )
            : interval === 'byHour'
            ? Object.keys(chartData[interval]).map((el) => el.slice(0, 5))
            : Object.keys(chartData[interval]).map((el) =>
                  el.slice(5).replace('-', '.').split('.').reverse().join('.')
              );
    }, [chartData, interval]);

    const datasets: ChartData<'line'>['datasets'] = useMemo(() => {
        return modeDesc.map((m, index) => {
            return {
                label: m.name,
                data: Object.values(chartData[interval]).map((el) => {
                    if (!el[m.query as QueryModeType]) {
                        return 0;
                    }
                    return el[m.query as QueryModeType];
                }),
                fill: {
                    value: -25,
                },
                spanGaps: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) {
                        return;
                    }
                    return getGradient(
                        ctx,
                        chartArea,
                        colors[index].first,
                        colors[index].second
                    );
                },
                pointBorderColor: 'transparent',
                pointRadius: 0,
                pointHoverRadius: 5,
                pointBackgroundColor: colors[index].border,
                pointHoverBorderColor: colors[index].border,
                borderColor: colors[index].border,
                cubicInterpolationMode: 'monotone',
            };
        });
    }, [chartData, interval, modeDesc]);

    const dataSet: ChartData<'line'> = useMemo(() => {
        return {
            labels: labels,
            datasets,
        };
    }, [datasets, labels]);

    if (dataSet.datasets[0].data.length === 0) {
        return (
            <div className={scss.line_chart_wrapper_empty}>
                <p>
                    По выбранной дате ничего нет, попробуйте выбрать другой день
                </p>
            </div>
        );
    }

    return (
        <Line
            options={options}
            className={scss.line_chart_wrapper}
            data={dataSet}
        />
    );
};
