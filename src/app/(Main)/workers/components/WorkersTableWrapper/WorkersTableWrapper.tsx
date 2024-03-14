'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import revalidate from 'utils/revalidate';
import { toast } from 'react-toastify';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { Spinner } from 'components/Spinner';

import { checkAccess } from 'utils/checkAccess';
import { deleteWorker } from 'http/workerApi';

import { warningToastConfig } from 'config/toastConfig';
import { NewWorkers, WorkerTableWrapperProps } from 'app/(Main)/workers/types';

const cookie = new Cookies();

export const WorkersTableWrapper: React.FC<WorkerTableWrapperProps> = ({
    workers,
    permissions,
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
                    revalidate(`/workers/${id}?which=docs`);
                    router.push(`/workers/${id}?which=docs`);
                } else {
                    toast('Недостаточно прав', warningToastConfig);
                }
            });
        } else {
            checkAccess(`business/${orgId}/worker/${id}/user`).then((d) => {
                if (d) {
                    revalidate(`/workers/${id}?which=docs`);
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
                handleDeleteClick={
                    permissions.includes('DELETE')
                        ? handleDeleteClick
                        : undefined
                }
                paginatorData={{
                    offset: 25,
                    countItems: workers.count,
                }}
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
