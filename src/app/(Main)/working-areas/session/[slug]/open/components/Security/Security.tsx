'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { useSocketConnect } from 'helpers/useSocketConnect';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';

import scss from './Security.module.scss';
import { useModalStore } from 'store/modalVisibleStore';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
}) => {
    const [worker, setWorker] = useState<IWorker>();
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const socket = useRef<WebSocket>();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        setVisible(false);
    }, [setVisible]);

    useSocketConnect({
        setLoading,
        setWorker,
        setWorkerDocs,
        socket: socket.current as WebSocket,
        sessionId: currentSessionId,
    });

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
            await getWorkerDocs(d.results[2].id).then((d) =>
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
                {worker?.id ? (
                    <WorkerInfoCard
                        worker={worker as IWorker}
                        workerDocs={workerDocs as IWorkerDocs[]}
                    />
                ) : (
                    <div className={scss.worker_empty_wrapper}>
                        <h2 className={scss.spinner_header}>
                            Ожидание работника
                        </h2>
                        <div className={scss.spinner}>
                            <SpinnerFit />
                        </div>
                    </div>
                )}
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
