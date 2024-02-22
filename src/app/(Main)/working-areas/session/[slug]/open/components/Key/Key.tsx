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
import { onWorkerClick } from 'app/(Main)/working-areas/session/[slug]/helpers/onWorkerClick';
import { CurrentSessionLogType } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';

import scss from './Key.module.scss';
import { getWorkerDocs } from 'http/workerApi';

export const Key: React.FC<KeyProps> = ({
    type,
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
    permissions,
}) => {
    const router = useRouter();
    const params = useParams();

    const itsInventory = getParamsType(params.slug) === 'inventory';

    const socketStore = useSocketStore((state) => state);

    const [temporaryData, setTemporaryData] = useState<CurrentSessionLogType[]>(
        []
    );
    const [sessionLogData, setSessionLogData] =
        useState<ModifiedRegisterLog[]>(sessionLog);

    const [loading, setLoading] = useState(false);

    const [responsibleWorker, setResponsibleWorker] = useState<IWorker>();
    const [responsibleWorkerDocs, setResponsibleWorkerDocs] =
        useState<IWorkerDocs[]>();

    const { worker, workerDocs, confirmed, setConfirmed, newWorker } =
        useSocketConnect({
            sessionId: currentSessionId,
            areaId: currentAreaId,
            setLoading,
        });

    useEffect(() => {
        setResponsibleWorker(worker);
        setResponsibleWorkerDocs(workerDocs);
    }, [worker, workerDocs]);

    useEffect(() => {
        if (responsibleWorker) {
            getWorkerDocs(+responsibleWorker?.id).then((docs) => {
                setResponsibleWorkerDocs(docs.results);
            });
        }
    }, [responsibleWorker]);

    useEffect(() => {
        setTemporaryData([]);
    }, [newWorker]);

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
    }, [socketStore.message, type]);

    useEffect(() => {
        return () => {
            if (socketStore.socket) {
                socketStore.closeConnection();
            }
        };
    }, []);

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'key-' + getParamsId(params.slug)
        );
        socketStore.closeConnection();
    };

    const handleRowClick = async (id: number) => {
        const workerId = sessionLogData.find((el) => el.id === id)?.worker.id;
        await onWorkerClick(workerId as number);
    };

    const handleRowDelete = async (id: number) => {
        setTemporaryData((d) => d.filter((el) => el.id !== id));
    };

    return (
        <>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton
                    onClick={() => socketStore.closeConnection()}
                    skipWord
                >
                    Назад
                </BackButton>
            </div>
            <div className={scss.key_layout}>
                {permissions.includes('DELETE') && (
                    <div className={scss.buttons_wrapper}>
                        <Button
                            onClick={() => onCloseSessionClick()}
                            type="button"
                        >
                            Завершить сессию
                        </Button>
                    </div>
                )}
                <div className={scss.key_content}>
                    <div className={scss.content_wrapper}>
                        <EnterCodeForm
                            setWorker={setResponsibleWorker}
                            temporaryLog={temporaryData}
                            confirmed={confirmed}
                            needWorker={!itsInventory}
                            setConfirmed={setConfirmed}
                            setTemporaryLog={setTemporaryData as any}
                            setSessionLog={setSessionLogData as any}
                            type={type}
                            worker={worker || (responsibleWorker as IWorker)}
                            sessionId={currentSessionId}
                            areaId={currentAreaId}
                        />
                        <div className={scss.worker_info_wrapper}>
                            {worker?.id || responsibleWorker?.id ? (
                                <WorkerInfoCard
                                    halfScreen
                                    worker={
                                        worker || (responsibleWorker as IWorker)
                                    }
                                    workerDocs={
                                        workerDocs ||
                                        (responsibleWorkerDocs as IWorkerDocs[])
                                    }
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
                {temporaryData.length !== 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h2 className={scss.temporary_table_title}>К выдаче</h2>
                        <Table
                            handleDeleteClick={handleRowDelete as any}
                            height="max-content"
                            tableData={temporaryData}
                            setTableData={setTemporaryData}
                            rowClickable={false}
                        >
                            <Column header="Работник" field="workerName" />
                            <Column header="Событие" field="modeName" />
                            <Column
                                header="Наименование"
                                field="inventoryName"
                            />
                        </Table>
                    </div>
                )}
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
