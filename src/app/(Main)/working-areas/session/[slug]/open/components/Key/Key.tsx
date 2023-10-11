'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
import { useSocketConnect } from 'hooks/useSocketConnect';

import scss from './Key.module.scss';
import { useModalStore } from 'store/modalVisibleStore';
import { getParamsId } from 'app/(Main)/working-areas/helpers';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { useSocketStore } from 'store/useSocketStore';

export const Key: React.FC<KeyProps> = ({
    type,
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
}) => {
    const [message] = useSocketStore((state) => [state.message]);
    const [closeConnection] = useSocketStore((state) => [
        state.closeConnection,
    ]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const params = useParams();

    useEffect(() => {
        if (!message) {
            router.replace(`/working-areas/session/key-${currentAreaId}`);
        }
    }, [message]);

    const { worker, workerDocs } = useSocketConnect({
        sessionId: currentSessionId,
        areaId: currentAreaId,
        setLoading,
    });

    const onCloseSessionClick = async () => {
        closeConnection();
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'key-' + getParamsId(params.slug),
            router
        );
    };

    return (
        <>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton onClick={() => closeConnection()} skipWord>
                    Назад
                </BackButton>
            </div>
            <div className={scss.key_layout}>
                <div className={scss.button_wrapper}>
                    <Button onClick={() => onCloseSessionClick()} type="button">
                        Завершить сессию
                    </Button>
                </div>
                <div className={scss.key_content}>
                    <div className={scss.content_wrapper}>
                        <EnterCodeForm
                            type={type}
                            worker={worker as IWorker}
                            sessionId={currentSessionId}
                            areaId={currentAreaId}
                        />
                        <div className={scss.worker_info_wrapper}>
                            {worker?.id ? (
                                <WorkerInfoCard
                                    halfScreen
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
                    <Table tableData={sessionLog} setTableData={() => {}}>
                        <Column header="Работник" field="workerName" />
                        <Column header="Дата" field="date" />
                        <Column header="Событие" field="modeName" />
                        <Column header="Наименование" field="inventoryName" />
                    </Table>
                )}
                {loading && <Spinner />}
            </div>
        </>
    );
};
