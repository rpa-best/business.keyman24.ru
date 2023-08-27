'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { deleteWorker } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { WorkerTableWrapperProps } from 'app/(Main)/workers/types';

export const WorkersTableWrapper: React.FC<WorkerTableWrapperProps> = ({
    workers,
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteWorker(id).finally(() => {
            setLoading(false);
            router.refresh();
        });
    };

    const handleRowClick = (id: number) => {
        router.push('/workers/' + id);
    };

    return (
        <>
            <Table
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteClick}
                tableRows={workers.results}
            >
                <Column header="ФИО" field="name" />
                <Column header="Имя пользователя" field="user" />
            </Table>
            {loading && <Spinner />}
        </>
    );
};
