import React from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { IModifiedInventory } from 'app/(Main)/inventory/types';

interface TableDocsWrapperProps {
    inventory: IModifiedInventory[] | null;
}

export const TableInventoryWrapper: React.FC<TableDocsWrapperProps> = ({
    inventory,
}) => {
    if (!inventory) {
        return null;
    }
    return (
        <Table tableData={inventory} setTableData={() => {}}>
            <Column header="Тип" field="type" />
            <Column header="Штрихкод" field="codeNumber" />
            <Column header="Наименование" field="name" />
        </Table>
    );
};
