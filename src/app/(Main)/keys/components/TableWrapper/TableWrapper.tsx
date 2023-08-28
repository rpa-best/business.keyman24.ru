'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';
import { TableProps } from 'components/Table/types';

interface TableWrapperProps {
    tableRows: Array<any>;
    children: TableProps['children'];
    path?: string;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
    children,
    tableRows,
    path,
}) => {
    const router = useRouter();

    const pathName = usePathname();

    const handleRowClick = (id: number) => {
        router.push(`${pathName}/${id}${path ? '/' + path : ''}`);
    };

    return (
        <Table handleRowClick={handleRowClick} tableRows={tableRows}>
            {children}
        </Table>
    );
};
