'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EnterCodeForm } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm';
import { IWorker, IWorkerDocs } from 'http/types';
import { KeyProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { useSocketConnect } from 'helpers/useSocketConnect';

import scss from './Key.module.scss';
import { useModalStore } from 'store/modalVisibleStore';

export const Key: React.FC<KeyProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
}) => {
    const [worker, setWorker] = useState<IWorker>();
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [loading, setLoading] = useState(false);
    const socket = useRef<WebSocket>();
    const router = useRouter();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        setVisible(false);
    }, [setVisible]);

    useSocketConnect({
        sessionId: currentSessionId,
        setWorkerDocs,
        setLoading,
        socket: socket.current as WebSocket,
        setWorker: setWorker,
    });

    const onCloseSessionClick = async () => {
        socket.current && socket.current?.close();
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'key',
            router
        );
    };

    return (
        <div className={scss.key_layout}>
            <div className={scss.button_wrapper}>
                <Button onClick={() => onCloseSessionClick()} type="button">
                    Завершить сессию
                </Button>
            </div>
            <div className={scss.key_content}>
                <div className={scss.content_wrapper}>
                    <EnterCodeForm
                        worker={worker as IWorker}
                        sessionId={currentSessionId}
                        areaId={currentAreaId}
                    />
                    <div className={scss.worker_info_wrapper}>
                        {worker?.id ? (
                            <WorkerInfoCard
                                worker={worker as IWorker}
                                workerDocs={workerDocs as IWorkerDocs[]}
                            />
                        ) : (
                            <div className={scss.worker_empty_wrapper}>
                                <h2 className={scss.spinner_header}>
                                    Приложите карту работника
                                </h2>
                                <div className={scss.spinner}>
                                    <SpinnerFit />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {sessionLog.length !== 0 && (
                <Table tableRows={sessionLog}>
                    <Column header="Работник" field="workerName" />
                    <Column header="Дата" field="date" />
                    <Column header="Событие" field="modeName" />
                    <Column header="Наименование ТМЦ" field="inventoryName" />
                </Table>
            )}
            {loading && <Spinner />}
        </div>
    );
};
