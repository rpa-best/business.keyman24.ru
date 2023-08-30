'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EnterCodeForm } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs } from 'http/types';
import { KeyProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Spinner } from 'components/Spinner';

import scss from './Key.module.scss';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';

export const Key: React.FC<KeyProps> = ({
    organizations,
    currentSessionId,
    currentAreaId,
}) => {
    const [worker, setWorker] = useState<IWorker>();
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            return await getWorkers();
        };
        fetchData().then(async (d) => {
            await getWorkerDocs(d.results[0].id, 1 as number).then((d) =>
                setWorkerDocs(d.results)
            );
            setWorker(d.results[0]);
        });
    }, []);

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'key',
            router
        );
    };

    return (
        <div>
            <div className={scss.button_wrapper}>
                <Button onClick={() => onCloseSessionClick()} type="button">
                    Завершить сессию
                </Button>
            </div>
            <div className={scss.key_content}>
                <div className={scss.content_wrapper}>
                    <EnterCodeForm />
                    <div className={scss.worker_info_wrapper}>
                        <WorkerInfoCard
                            halfScreen
                            worker={worker as IWorker}
                            workerDocs={workerDocs as IWorkerDocs[]}
                        />
                    </div>
                </div>
            </div>
            {loading && <Spinner />}
        </div>
    );
};
