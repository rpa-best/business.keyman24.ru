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
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';
import { sendSessionAction } from 'http/workingAreaApi';
import { useSocketStore } from 'store/useSocketStore';
import revalidate from 'utils/revalidate';

import { updateOrg } from 'http/organizationApi';

import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './Security.module.scss';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorToastOptions } from 'config/toastConfig';

export const Security: React.FC<SecurityProps> = ({
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
}) => {
    const path = usePathname();
    const router = useRouter();
    const params = useParams();

    const socketStore = useSocketStore((state) => state);

    const [sessionLogData, setSessionLogData] =
        useState<typeof sessionLog>(sessionLog);

    const [sended, setSended] = useState(false);
    const [loading, setLoading] = useState(false);

    const { worker, workerDocs } = useSocketConnect({
        setLoading,
        sessionId: currentSessionId,
        areaId: currentAreaId,
    });

    useEffect(() => {
        if (!socketStore.socket) {
            router.replace(`/working-areas/session/security-${currentAreaId}`);
        }
        /* return () => {
            if (socketStore.socket) {
                socketStore.closeConnection();
            }
        };*/
    }, [currentAreaId, socketStore.socket]);

    useEffect(() => {
        if (socketStore.message?.type === 'success') {
            setSended(false);
        }
    }, [socketStore.message]);

    useEffect(() => {
        const { message } = socketStore;
        if (sended) {
            return;
        }
        if (message?.type === 'error') {
            return;
        }
        if (!message?.data.use_session) {
            return;
        }
        if (message && message.data.use_session) {
            const body = {
                session: currentSessionId,
                worker: message.data.worker.id,
                mode: message.data.mode,
                user: message.data.user,
            };
            sendSessionAction(currentAreaId, currentSessionId, body as any)
                .then((s) => {
                    const mode = s.mode ? 'Зашёл' : 'Вышел';
                    const newLog = {
                        ...s,
                        workerName: s.worker.name,
                        modeName: mode,
                    };
                    setSessionLogData((log) => [newLog, ...log]);
                    revalidate(path);
                    setSended(true);
                })
                .catch((e) => {
                    if (e instanceof AxiosError) {
                        toast(
                            e.response?.data.error.name ?? 'Ошибка',
                            errorToastOptions
                        );
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [socketStore.message, socketStore.message?.data.use_session]);

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'security-' + getParamsId(params.slug)
        );
        socketStore.closeConnection();
    };

    const handleRowClick = (id: number) => {
        const workerId = sessionLogData.find((el) => el.id === id)?.worker.id;
        window.open(
            `https://${window.location.host}/workers/${workerId}?which=docs`,
            '_blank'
        );
    };

    const handleUpdateClick = async () => {
        setLoading(true);
        await updateOrg().finally(() => {
            setLoading(false);
        });
    };

    return (
        <>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            <div>
                <div className={scss.buttons_wrapper}>
                    <Button onClick={() => onCloseSessionClick()} type="button">
                        Завершить сессию
                    </Button>
                    <div className={scss.utils_buttons}>
                        <Button
                            onClick={() => handleUpdateClick()}
                            type="button"
                        >
                            Обновить данные
                        </Button>
                    </div>
                </div>
                <div className={scss.working_view_wrapper}>
                    {worker?.id ? (
                        <div className={scss.worker_info_wrapper_custom}>
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
                        <Table
                            handleRowClick={handleRowClick}
                            tableData={sessionLogData}
                            setTableData={setSessionLogData}
                        >
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
