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

    const history = await getServerHistory(+orgId);

    return (
        <div>
            <HistoryButtonsWrapper />
            <Table tableRows={history.results}>
                <Column sortable header="Дата" field="date" />
                <Column sortable header="Тип операции" field="type" />
                <Column sortable header="Количество" field="cost" />
            </Table>
        </div>
    );
};

export default BillHistoryPage;
