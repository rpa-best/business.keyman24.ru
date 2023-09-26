import React from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { IModifiedInventory } from 'app/(Main)/inventory/types';

interface TableDocsWrapperProps {
    inventory: IModifiedInventory[];
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
