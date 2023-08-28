'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';
import { TableProps } from 'components/Table/types';
import { Spinner } from 'components/Spinner';
import { deleteLocation } from 'http/locationsApi';

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
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const pathName = usePathname();

    const handleAddClick = () => {
        router.push(`${pathName}/create`);
    };

    const handleEditClick = (id: number) => {
        router.push(`${pathName}/edit/${id}`);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteLocation(id).finally(() => {
            setLoading(false);
            router.refresh();
        });
    };

    const handleRowClick = (id: number) => {
        router.push(`${pathName}/${id}${path ? '/' + path : ''}`);
    };

    return (
        <>
            <Table
                buttonData={{
                    onClick: () => handleAddClick(),
                    text: 'Добавить',
                }}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
                handleRowClick={handleRowClick}
                tableRows={tableRows}
            >
                {children}
            </Table>
            {loading && <Spinner />}
        </>
    );
};
