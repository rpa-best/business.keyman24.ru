'use client';

import React from 'react';

import { Column } from 'components/Table/Column';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';

interface ObjectsTableWrapper {
    modifiedObjects: any;
}

export const ObjectsTableWrapper: React.FC<ObjectsTableWrapper> = ({
    modifiedObjects,
}) => {
    const router = useRouter();

    const pathname = usePathname();

    const handleRowClick = (id: number) => {
        router.push(`${pathname}/${id}`);
    };

    return (
        <Table handleRowClick={handleRowClick} tableRows={modifiedObjects}>
            <Column header="Наименование" field="name" />
            <Column header="Описание" field="desc" />
        </Table>
    );
};
