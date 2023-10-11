import { BarChart } from 'components/Charts/BarChart';
import { PieChart } from 'components/Charts/PieChart/PieChart';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import React from 'react';
import { formatDateHistory, getBarGroupData } from 'utils/historyHelper';
import { IInventoryHistory, IResponse } from 'http/types';

import scss from './HistoryComponent.module.scss';

interface KeyHistoryComponentProps {
    keyHistory: IResponse<IInventoryHistory>;
    type: 'Inventory' | 'Keys';
}

export const HistoryComponent: React.FC<KeyHistoryComponentProps> = ({
    keyHistory,
    type,
}) => {
    const emptyText = type === 'Inventory' ? 'инвентарь' : 'ключ';

    const cloneHistory = formatDateHistory(keyHistory.results);

    const [barLabels, barData] = getBarGroupData(cloneHistory, 'worker.name');
    const [labels, data] = getBarGroupData(cloneHistory, 'worker.org.name');

    const tableHistoryRows = cloneHistory.map((h) => {
        const mode = h.mode ? 'Взял' : 'Сдал';

        return {
            id: h.id,
            date: h.date.toLocaleDateString('ru'),
            time: h.date.toString().slice(16, 24),
            name: h.worker.name,
            status: mode,
        };
    });

    return (
        <>
            {barData?.length !== 0 ? (
                <>
                    <div className={scss.charts_wrapper}>
                        <div className={scss.bar_chart_wrapper}>
                            <h2 className={scss.custom_title}>
                                Время по работникам
                            </h2>
                            <div className={scss.bar_chart}>
                                <BarChart
                                    labels={barLabels}
                                    data={barData}
                                    dataLabels="Время в часах"
                                />
                            </div>
                        </div>
                        <div className={scss.pie_chart_wrapper}>
                            <h2 className={scss.custom_title}>
                                Время по организациям
                            </h2>
                            <div className={scss.pie_chart}>
                                <PieChart
                                    labels={labels}
                                    data={data}
                                    dataLabels="Время в часах"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={scss.children_with_table}>
                        <Table
                            paginatorData={{
                                offset: 30,
                                countItems: keyHistory.count,
                            }}
                            setTableData={[] as any}
                            tableData={tableHistoryRows}
                        >
                            <Column header="Дата" field="date" />
                            <Column header="Время" field="time" />
                            <Column header="ФИО" field="name" />
                            <Column header="Событие" field="status" />
                        </Table>
                    </div>
                </>
            ) : (
                <p className={scss.empty_key}>
                    Этот {emptyText} ещё не использовался
                </p>
            )}
        </>
    );
};
