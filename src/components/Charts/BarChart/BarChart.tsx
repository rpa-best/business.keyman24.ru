'use client';
import React from 'react';
import 'chart.js/auto';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartProps } from 'components/Charts/types';

import scss from 'components/Charts/Charts.module.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options: ChartOptions<'bar'> = {
    color: 'rgba(255, 255, 255)',
    backgroundColor: '#31D79B',
    maintainAspectRatio: false,
    responsive: true,
};

export const BarChart: React.FC<ChartProps> = ({
    labels,
    data,
    dataLabels,
}) => {
    const dataSet: ChartData<'bar'> = {
        labels: labels,
        datasets: [
            {
                label: dataLabels,
                data,
                borderWidth: 1,
                barPercentage: 0.5,
                barThickness: 'flex',
                minBarLength: 30,
                hoverBackgroundColor: '#308D92',
            },
        ],
    };
    return <Bar className={scss.container} options={options} data={dataSet} />;
};
