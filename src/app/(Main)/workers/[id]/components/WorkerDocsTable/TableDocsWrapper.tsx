import React from 'react';

import { IWorkerDocs } from 'http/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';

interface TableDocsWrapperProps {
    data: IWorkerDocs[];
}

export const TableDocsWrapper: React.FC<TableDocsWrapperProps> = ({ data }) => {
    return (
        <Table tableRows={data}>
            <Column header="Наименование" field="name" />
            <Column header="Дата начала" field="activeFrom" />
            <Column header="Дата окончания" field="activeTo" />
        </Table>
    );
};
