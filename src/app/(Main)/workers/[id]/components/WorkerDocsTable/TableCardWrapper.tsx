import React from 'react';

import { ICard } from 'http/types';
import { Column } from 'components/Table/Column';
import { Table } from 'components/Table';

export const TableCardWrapper = ({ data }: { data: ICard[] | null }) => {
    if (!data) {
        return null;
    }
    return (
        <Table tableData={data} setTableData={() => {}}>
            <Column header="Номер" field="id" />
            <Column header="Наименование" field="card" />
        </Table>
    );
};
