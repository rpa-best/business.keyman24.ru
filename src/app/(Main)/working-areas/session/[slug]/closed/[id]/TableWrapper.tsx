'use client';

import React from 'react';
import { Table } from 'components/Table';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { useParams } from 'next/navigation';
import { getParamsType } from 'app/(Main)/working-areas/helpers';
import Cookies from 'universal-cookie';
import { checkAccess } from 'utils/checkAccess';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';
import { onWorkerClick } from 'app/(Main)/working-areas/session/[slug]/helpers/onWorkerClick';

const cookie = new Cookies();

interface TableRowsType
    extends Omit<ModifiedRegisterLog, 'modeName' | 'inventoryName' | 'mode'> {
    mode: string;
}

interface TableWrapperProps {
    children: React.ReactNode;
    tableRows: TableRowsType[];
    count: number;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
    children,
    tableRows,
    count,
}) => {
    const params = useParams();

    const itsRegisterInventory =
        getParamsType(params.slug) === 'register_inventory';

    const handleRowClick = async (id: number) => {
        if (itsRegisterInventory) {
            return;
        }
        const workerId = tableRows.find((el) => el.id === id)?.worker.id;
        await onWorkerClick(workerId as number);
    };

    return (
        <Table
            paginatorData={{
                offset: 25,
                countItems: count,
            }}
            handleRowClick={handleRowClick}
            tableData={tableRows}
            setTableData={() => {}}
        >
            {children as any}
        </Table>
    );
};
