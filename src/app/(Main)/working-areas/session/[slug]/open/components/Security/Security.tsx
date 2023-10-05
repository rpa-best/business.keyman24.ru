'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';
import { SecurityProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { Spinner } from 'components/Spinner';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { IWorker, IWorkerDocs } from 'http/types';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useSocketConnect } from 'helpers/useSocketConnect';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { useModalStore } from 'store/modalVisibleStore';
import { getParamsId } from 'app/(Main)/working-areas/helpers';
import { sendSessionAction } from 'http/workingAreaApi';

import scss from './Security.module.scss';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
}) => {
    const router = useRouter();
    const [sended, setSended] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, worker, workerDocs, errors, socketClose } = useSocketConnect({
        setLoading,
        sessionId: currentSessionId,
        areaId: currentAreaId,
    });
    const params = useParams();

    useEffect(() => {
        setSended(false);
    }, [data]);

    useEffect(() => {
        if (errors) {
            return;
        }
        if (sended) {
            return;
        }
        if (data && workerDocs) {
            const body = {
                session: currentSessionId,
                worker: data.data.worker.id,
                mode: data.data.mode,
                user: data.data.user,
            };
            sendSessionAction(currentAreaId, currentSessionId, body as any)
                .then(() => {
                    setSended(true);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [currentAreaId, currentSessionId, data, errors, workerDocs]);

    const onCloseSessionClick = async () => {
        socketClose();
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'security-' + getParamsId(params.slug),
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
                    <Table tableRows={sessionLog}>
                        <Column header="Работник" field="workerName" />
                        <Column header="Дата" field="date" />
                        <Column header="Тип" field="modeName" />
                    </Table>
                </div>
            </div>
            {loading && <Spinner />}
        </div>
    );
};
