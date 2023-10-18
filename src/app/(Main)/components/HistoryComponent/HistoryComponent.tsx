import { BarChart } from 'components/Charts/BarChart';
import { PieChart } from 'components/Charts/PieChart/PieChart';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import React from 'react';
import { formatDateHistory, getBarGroupData } from 'utils/historyHelper';
import { IInventoryHistory, IResponse } from 'http/types';

import scss from './HistoryComponent.module.scss';
import { LocationButton } from 'app/(Main)/components/HistoryComponent/LocationButton';

interface KeyHistoryComponentProps {
    keyHistory: IResponse<IInventoryHistory>;
    type: 'Inventory' | 'Keys';
    register?: boolean;
}

export const HistoryComponent: React.FC<KeyHistoryComponentProps> = ({
    keyHistory,
    type,
    register,
}) => {
    const emptyText = type === 'Inventory' ? 'инвентарь' : 'ключ';

    const cloneHistory = formatDateHistory(keyHistory.results);

    const [barLabels, barData] = !register
        ? getBarGroupData(cloneHistory, 'worker.name')
        : getBarGroupData(cloneHistory, 'inventory.location.name');
    const [labels, data] = !register
        ? getBarGroupData(cloneHistory, 'worker.org.name')
        : [null, null];

    const tableHistoryRows = cloneHistory.map((h) => {
        const mode = h.mode
            ? register
                ? 'Зарегестрировано'
                : 'Взял'
            : register
            ? 'Сдано'
            : 'Сдал';
        const locationName = h?.inventory?.location?.name;

        return {
            id: h.id,
            date: h.date.toLocaleDateString('ru'),
            time: h.date.toString().slice(16, 24),
            name: h?.worker?.name,
            locationName,
            status: mode,
        };
    });

    return (
        <>
            {type !== 'Keys' && (
                <div
                    className={scss.charts_button}
                    style={{
                        width: 'max-content',
                        marginBottom: register ? '0' : '20px',
                    }}
                >
                    <LocationButton />
                </div>
            )}
            {barData?.length !== 0 ? (
                <>
                    <div className={scss.charts_wrapper}>
                        <div
                            className={
                                !register
                                    ? scss.bar_chart_wrapper
                                    : scss.bar_chart_solo
                            }
                        >
                            <h2 className={scss.custom_title}>
                                Время по работникам
                            </h2>
                            <div className={scss.bar_chart}>
                                <BarChart
                                    labels={barLabels as any}
                                    data={barData as any}
                                    dataLabels="Время в часах"
                                />
                            </div>
                        </div>
                        {!register && (
                            <div className={scss.pie_chart_wrapper}>
                                <h2 className={scss.custom_title}>
                                    Время по организациям
                                </h2>
                                <div className={scss.pie_chart}>
                                    <PieChart
                                        labels={labels as any}
                                        data={data as any}
                                        dataLabels="Время в часах"
                                    />
                                </div>
                            </div>
                        )}
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
                            {!register ? (
                                <Column header="ФИО" field="name" />
                            ) : (
                                <Column header="Локация" field="locationName" />
                            )}
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
