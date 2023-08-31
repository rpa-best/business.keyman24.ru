'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';
import { SecurityProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs } from 'http/types';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';

import scss from './Security.module.scss';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
}) => {
    const [worker, setWorker] = useState<IWorker>();
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'security',
            router
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            return await getWorkers();
        };
        fetchData().then(async (d) => {
            await getWorkerDocs(d.results[2].id, 1 as number).then((d) =>
                setWorkerDocs(d.results)
            );
            setWorker(d.results[0]);
        });
    }, []);

    return (
        <div>
            <div className={scss.button_wrapper}>
                <Button onClick={() => onCloseSessionClick()} type="button">
                    Завершить сессию
                </Button>
            </div>
            <div className={scss.working_view_wrapper}>
                <div className={scss.working_view_card}>
                    <WorkerInfoCard
                        worker={worker as IWorker}
                        workerDocs={workerDocs as IWorkerDocs[]}
                    />
                </div>
                <div className={scss.working_view_table}>
                    <Table tableRows={sessionLog}>
                        <Column header="Работник" field="workerName" />
                        <Column header="Дата" field="date" />
                        <Column header="Тип" field="mode" />
                    </Table>
                </div>
            </div>
            {loading && <Spinner />}
        </div>
    );
};
