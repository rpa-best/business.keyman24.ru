import React from 'react';

import { ICard } from 'http/types';
import { Column } from 'components/Table/Column';
import { Table } from 'components/Table';

export const TableCardWrapper = ({ data }: { data: ICard[] }) => {
    return (
        <Table tableRows={data}>
            <Column header="Номер" field="id" />
            <Column header="Наименование" field="card" />
        </Table>
    );
};
