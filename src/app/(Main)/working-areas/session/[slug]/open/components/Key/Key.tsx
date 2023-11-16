'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { EnterCodeForm } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm';
import { IWorker, IWorkerDocs } from 'http/types';
import {
    KeyProps,
    ModifiedRegisterLog,
} from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { useSocketConnect } from 'hooks/useSocketConnect';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { useSocketStore } from 'store/useSocketStore';

import scss from './Key.module.scss';

export const Key: React.FC<KeyProps> = ({
    type,
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
}) => {
    const router = useRouter();
    const params = useParams();

    const itsRegisterInventory =
        getParamsType(params.slug) === 'register_inventory';

    const socketStore = useSocketStore((state) => state);

    const [sessionLogData, setSessionLogData] =
        useState<ModifiedRegisterLog[]>(sessionLog);

    const [loading, setLoading] = useState(false);

    const { worker, workerDocs } = useSocketConnect({
        sessionId: currentSessionId,
        areaId: currentAreaId,
        setLoading,
    });

    useEffect(() => {
        if (!socketStore.socket) {
            if (type === 'keys') {
                router.replace(`/working-areas/session/key-${currentAreaId}`);
            } else {
                router.replace(
                    `/working-areas/session/inventory-${currentAreaId}`
                );
            }
        }
        return () => {
            if (socketStore.socket) {
                socketStore.closeConnection();
            }
        };
    }, [socketStore.message, type]);

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'key-' + getParamsId(params.slug)
        );
        socketStore.closeConnection();
    };

    const handleRowClick = (id: number) => {
        if (itsRegisterInventory) {
            return;
        }
        const workerId = sessionLogData.find((el) => el.id === id)?.worker.id;
        window.open(
            `https://${window.location.host}/workers/${workerId}?which=docs`,
            '_blank'
        );
    };

    return (
        <>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            <div className={scss.key_layout}>
                <div className={scss.buttons_wrapper}>
                    <Button onClick={() => onCloseSessionClick()} type="button">
                        Завершить сессию
                    </Button>
                </div>
                <div className={scss.key_content}>
                    <div className={scss.content_wrapper}>
                        <EnterCodeForm
                            setSessionLog={setSessionLogData as any}
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
                    <Table
                        handleRowClick={handleRowClick}
                        tableData={sessionLogData}
                        setTableData={setSessionLogData}
                    >
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
