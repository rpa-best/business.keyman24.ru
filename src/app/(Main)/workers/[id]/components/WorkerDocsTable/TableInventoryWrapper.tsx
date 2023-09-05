import React from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { WorkerInventoryType } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/WorkerDocsTable';

interface TableDocsWrapperProps {
    inventory: WorkerInventoryType[];
}

export const TableInventoryWrapper: React.FC<TableDocsWrapperProps> = ({
    inventory,
}) => {
    return (
        <Table tableRows={inventory}>
            <Column header="Тип" field="type" />
            <Column header="Штрихкод" field="codeNumber" />
            <Column header="Наименование" field="name" />
        </Table>
    );
};
