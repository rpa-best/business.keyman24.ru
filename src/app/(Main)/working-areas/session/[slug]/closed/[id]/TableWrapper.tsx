'use client';

import React from 'react';
import { Table } from 'components/Table';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { useParams, useRouter } from 'next/navigation';
import { getParamsType } from 'app/(Main)/working-areas/helpers';

interface TableRowsType
    extends Omit<ModifiedRegisterLog, 'modeName' | 'inventoryName' | 'mode'> {
    mode: string;
}

interface TableWrapperProps {
    children: React.ReactNode;
    tableRows: TableRowsType[];
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
    children,
    tableRows,
}) => {
    const params = useParams();

    const itsRegisterInventory =
        getParamsType(params.slug) === 'register_inventory';

    const handleRowClick = (id: number) => {
        if (itsRegisterInventory) {
            return;
        }
        const workerId = tableRows.find((el) => el.id === id)?.worker.id;
        window.open(
            `https://${window.location.host}/workers/${workerId}?which=docs`,
            '_blank'
        );
    };

    return (
        <Table
            handleRowClick={handleRowClick}
            tableData={tableRows}
            setTableData={() => {}}
        >
            {children as any}
        </Table>
    );
};
