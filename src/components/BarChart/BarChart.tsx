'use client';
import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

import { BarChartProps } from 'components/BarChart/types';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};

import scss from './BarChart.module.scss';

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
    return <Bar options={options} data={data} />;
};
