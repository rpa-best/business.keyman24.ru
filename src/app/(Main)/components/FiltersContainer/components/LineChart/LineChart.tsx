'use client';

import React from 'react';

import { LineChartData } from 'http/types';

interface LineChartProps {
    chartData: LineChartData;
}

export const LineChart: React.FC<LineChartProps> = ({ chartData }) => {
    console.log(chartData);
    return <></>;
};
