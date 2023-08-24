'use client';

import React from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useRouter } from 'next/navigation';

import scss from './inventory.module.scss';

const body = [
    {
        id: 1,
        name: 'testiruem',
    },
    {
        id: 2,
        name: 'круто',
    },
    {
        id: 3,
        name: 'абвг',
    },
    {
        id: 4,
        name: 'пявпв',
    },
    {
        id: 5,
        name: 'мячмямс',
    },
    {
        id: 6,
        name: 'ияыаф',
    },
];

export default function InventoryPage() {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`inventory/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        alert('удаляем');
    };

    const handleEditClick = (id: number) => {
        alert('редачим');
    };

    const handleTableButtonClick = () => {
        alert('aue');
    };

    return (
        <div className={scss.children}>
            <h2 className={scss.inventory_title}>Устройство / Список</h2>
            <Table
                buttonData={{
                    onClick: handleTableButtonClick,
                    text: 'Добавить',
                }}
                rowClickable={true}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
                handleRowClick={handleRowClick}
                tableRows={body}
                paginator
            >
                <Column sortable header="imya" field="name" />
                <Column sortable header="айди" field="id" />
            </Table>
        </div>
    );
}
