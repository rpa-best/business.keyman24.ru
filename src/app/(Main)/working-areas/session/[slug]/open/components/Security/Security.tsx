'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';
import { closeSession } from 'http/workingAreaApi';
import { SecurityProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs } from 'http/types';

import scss from './Security.module.scss';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
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
            return await getWorkers(1);
        };
        fetchData().then(async (d) => {
            await getWorkerDocs(d.results[0].id, 1 as number).then((d) =>
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
            <WorkerInfoCard
                worker={worker as IWorker}
                workerDocs={workerDocs as IWorkerDocs[]}
            />
            {loading && <Spinner />}
        </div>
    );
};
