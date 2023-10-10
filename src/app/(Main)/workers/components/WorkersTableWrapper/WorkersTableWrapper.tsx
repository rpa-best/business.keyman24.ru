'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { deleteWorker } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { NewWorkers, WorkerTableWrapperProps } from 'app/(Main)/workers/types';

export const WorkersTableWrapper: React.FC<WorkerTableWrapperProps> = ({
    workers,
}) => {
    const [tableData, setTableData] = useState<NewWorkers[]>(workers.results);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTableData(workers.results);
    }, [workers]);

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteWorker(id).finally(() => {
            setLoading(false);
        });
    };

    const handleRowClick = (id: number) => {
        router.push(`/workers/${id}?which=docs`);
    };

    return (
        <>
            <Table
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteClick}
                tableData={tableData}
                setTableData={setTableData}
            >
                <Column header="ФИО" field="name" />
                <Column header="Имя пользователя" field="user" />
                <Column sortable header="Организация" field="org" />
            </Table>
            {loading && <Spinner />}
        </>
    );
};
