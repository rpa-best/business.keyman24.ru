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
import { Pie } from 'react-chartjs-2';

import scss from 'components/Charts/Charts.module.scss';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

import { ChartProps } from 'components/Charts/types';

export const options: ChartOptions<'pie'> = {
    color: 'rgba(255, 255, 255)',
    maintainAspectRatio: true,
    responsive: true,
};

export const PieChart: React.FC<ChartProps> = ({
    labels,
    data,
    dataLabels,
}) => {
    const dataSet: ChartData<'pie'> = {
        labels: labels,
        datasets: [
            {
                label: dataLabels,
                data,
                borderWidth: 1,
                hoverOffset: 2,
                clip: 10,
                hoverBackgroundColor: '#308D92',
            },
        ],
    };
    return (
        <Pie className={scss.pie_container} options={options} data={dataSet} />
    );
};
