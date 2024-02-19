import { cookies } from 'next/headers';

import { getServerHistory } from 'http/organizationApi';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { HistoryButtonsWrapper } from 'app/(Main)/org-settings/bill/bill-history/components/HistoryButtonsWrapper';
import React from 'react';

interface BillHistoryPageProps {
    searchParams: { type: 'day' | 'month' };
}

const BillHistoryPage: React.FC<BillHistoryPageProps> = async ({
    searchParams,
}) => {
    const cookieStore = cookies();

    const day = searchParams.type ? searchParams.type === 'day' : true;

    const orgId = cookieStore.get('orgId')?.value as string;

    const history = await getServerHistory(+orgId, day ? undefined : 'month');

    const cloneHistory = history.results
        .map((el) => {
            const typeName = el.type === 'service' ? 'Списание' : 'Пополнение';
            return { ...el, typeName, date: el.date.slice(0, 10) };
        })
        .reverse();

    return (
        <div>
            <HistoryButtonsWrapper />
            <Table tableData={cloneHistory} setTableData={[] as any}>
                <Column header="Дата" field="date" />
                <Column header="Тип операции" field="typeName" />
                <Column header="Стоимость в рублях" field="cost" />
            </Table>
        </div>
    );
};

export default BillHistoryPage;
