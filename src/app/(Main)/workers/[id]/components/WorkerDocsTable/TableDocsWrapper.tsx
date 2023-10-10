import React from 'react';

import { IWorkerDocs } from 'http/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';

interface TableDocsWrapperProps {
    data: IWorkerDocs[] | null;
}

export const TableDocsWrapper: React.FC<TableDocsWrapperProps> = ({ data }) => {
    if (!data) {
        return null;
    }
    return (
        <Table tableData={data} setTableData={() => {}}>
            <Column header="Наименование" field="name" />
            <Column header="Дата начала" field="activeFrom" />
            <Column header="Дата окончания" field="activeTo" />
        </Table>
    );
};
