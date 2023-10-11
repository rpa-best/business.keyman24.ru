'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';
import { SecurityProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { IWorker, IWorkerDocs } from 'http/types';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useSocketConnect } from 'hooks/useSocketConnect';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { getParamsId } from 'app/(Main)/working-areas/helpers';
import { sendSessionAction } from 'http/workingAreaApi';
import { useSocketStore } from 'store/useSocketStore';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './Security.module.scss';
import revalidate from 'utils/revalidate';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
}) => {
    const path = usePathname();
    const socketStore = useSocketStore((state) => state);
    const router = useRouter();
    const [sended, setSended] = useState(false);
    const [loading, setLoading] = useState(false);

    const { worker, workerDocs, errors } = useSocketConnect({
        setLoading,
        sessionId: currentSessionId,
        areaId: currentAreaId,
    });

    useEffect(() => {
        if (!socketStore.message) {
            router.replace(`/working-areas/session/security-${currentAreaId}`);
        }
    }, [socketStore.message]);

    const params = useParams();

    useEffect(() => {
        setSended(false);
    }, [socketStore.message]);

    useEffect(() => {
        const { message } = socketStore;
        if (errors) {
            return;
        }
        if (sended) {
            return;
        }
        if (message && workerDocs) {
            const body = {
                session: currentSessionId,
                worker: message.data.worker.id,
                mode: message.data.mode,
                user: message.data.user,
            };
            sendSessionAction(currentAreaId, currentSessionId, body as any)
                .then(() => {
                    revalidate(path);
                    setSended(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [
        socketStore.message,
        errors,
        workerDocs,
        currentSessionId,
        currentAreaId,
    ]);

    const onCloseSessionClick = async () => {
        socketStore.closeConnection();
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'security-' + getParamsId(params.slug),
            router
        );
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
            <div>
                <div className={scss.button_wrapper}>
                    <Button onClick={() => onCloseSessionClick()} type="button">
                        Завершить сессию
                    </Button>
                </div>
                <div className={scss.working_view_wrapper}>
                    {worker?.id ? (
                        <div className={scss.worker_info_wrapper}>
                            <WorkerInfoCard
                                halfScreen
                                worker={worker as IWorker}
                                workerDocs={workerDocs as IWorkerDocs[]}
                            />
                        </div>
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
                        <Table tableData={sessionLog} setTableData={() => {}}>
                            <Column header="Работник" field="workerName" />
                            <Column header="Дата" field="date" />
                            <Column header="Тип" field="modeName" />
                        </Table>
                    </div>
                </div>
                {loading && <Spinner />}
            </div>
        </>
    );
};
