import { ChartArea } from 'chart.js';

export function getGradient(
    ctx: CanvasRenderingContext2D,
    chartArea: ChartArea,
    first: string,
    second: string
) {
    const gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
    );
    gradient.addColorStop(0.8, first);
    gradient.addColorStop(0.2, second);
    gradient.addColorStop(0.01, 'rgba(0, 0, 0, 0)');
    return gradient;
}
