'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { deleteWorker } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { NewWorkers, WorkerTableWrapperProps } from 'app/(Main)/workers/types';
import { checkAccess } from 'utils/checkAccess';
import { toast } from 'react-toastify';
import { warningToastConfig } from 'config/toastConfig';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export const WorkersTableWrapper: React.FC<WorkerTableWrapperProps> = ({
    workers,
}) => {
    const router = useRouter();

    const [tableData, setTableData] = useState<NewWorkers[]>(workers.results);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTableData(workers.results);
    }, [workers]);

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        return await deleteWorker(id).finally(() => {
            setLoading(false);
        });
    };

    const handleRowClick = (id: number) => {
        const orgId = cookie.get('orgId');

        const selectedWorker = tableData.find((worker) => worker.id === id);

        if (selectedWorker?.user === '-') {
            const workerWithUser = tableData.find((el) => el.user !== '-');
            checkAccess(
                `business/${orgId}/worker/${workerWithUser?.id}/user`
            ).then((d) => {
                if (d) {
                    router.prefetch(`/workers/${id}?which=docs`);
                    router.push(`/workers/${id}?which=docs`);
                } else {
                    toast('Недостаточно прав', warningToastConfig);
                }
            });
        } else {
            checkAccess(`business/${orgId}/worker/${id}/user`).then((d) => {
                if (d) {
                    router.prefetch(`/workers/${id}?which=docs`);
                    router.push(`/workers/${id}?which=docs`);
                } else {
                    toast('Недостаточно прав', warningToastConfig);
                }
            });
        }
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
