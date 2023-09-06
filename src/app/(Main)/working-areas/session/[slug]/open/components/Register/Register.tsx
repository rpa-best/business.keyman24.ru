'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import UniversalCookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { sendSessionAction } from 'http/workingAreaApi';
import { RegisterProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IOrganization } from 'store/types';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Spinner } from 'components/Spinner';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { useModalStore } from 'store/modalVisibleStore';
import { Column } from 'components/Table/Column';

import scss from './Register.module.scss';
import { AxiosError } from 'axios';

const cookie = new UniversalCookies();

export const Register: React.FC<RegisterProps> = ({
    organizations,
    currentSessionId,
    currentAreaId,
    sessionLog,
}) => {
    const router = useRouter();

    const [errors, setErrors] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<IOrganization>();
    const [selectedWorker, setSelectedWorker] = useState<IWorker>();
    const [selectedWorkerDocs, setSelectedWorkerDocs] =
        useState<IWorkerDocs[]>();
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [loading, setLoading] = useState(false);
    const socket = useRef<WebSocket>();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        setVisible(false);
    }, [setVisible]);

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            setLoading(true);
            const body = {
                user: data.data.user,
                mode: data.data.mode,
                worker: selectedWorker?.id,
                device: data.data.device,
            };
            sendSessionAction(currentAreaId, currentSessionId, body as any)
                .catch((e: unknown) => {
                    if (e instanceof AxiosError) {
                        toast(e.response?.data.error[0].slug, {
                            position: 'bottom-right',
                            hideProgressBar: true,
                            autoClose: 600000,
                            type: 'error',
                            theme: 'colored',
                        });
                    }
                })
                .finally(() => {
                    router.refresh();
                    setLoading(false);
                });
        },
        [currentAreaId, currentSessionId, router, selectedWorker?.id]
    );

    useEffect(() => {
        const access = cookie.get('access');
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${currentSessionId}/?token=${access}`
        );

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'success') {
                if (errors) {
                    return;
                }
                onSocketSuccess(message);
            }
        };

        return () => {
            socket?.current?.close();
        };
    }, [currentSessionId, errors, onSocketSuccess]);

    const handleSelectOrg = (org: IOrganization) => {
        setLoading(true);
        setSelectedOrg(org);
        const fetchData = async () => {
            return await getWorkers();
        };
        fetchData()
            .then((d) => setWorkers(d.results))
            .finally(() => setLoading(false));
    };

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'register',
            router
        );
    };

    const handleSelectWorker = (worker: IWorker) => {
        setLoading(true);
        setSelectedWorker(worker);
        const fetchData = async () => {
            return await getWorkerDocs(worker.id);
        };
        fetchData()
            .then((d) => setSelectedWorkerDocs(d.results))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <div className={scss.button_register_wrapper}>
                <Button onClick={() => onCloseSessionClick()} type="button">
                    Завершить сессию
                </Button>
            </div>
            <div className={scss.inputs_wrapper}>
                <div>
                    <InputSelect
                        listValues={organizations}
                        placeholder="Выберите организацию"
                        onChange={handleSelectOrg}
                        value={selectedOrg?.name ?? ''}
                        name="organization"
                    />
                </div>
                {selectedOrg && (
                    <div>
                        <InputSelect
                            listValues={workers}
                            placeholder="Выберите работника"
                            onChange={handleSelectWorker}
                            value={selectedWorker?.name ?? ''}
                            name="workers"
                        />
                    </div>
                )}
            </div>
            {selectedOrg && selectedWorker && (
                <div className={scss.working_view_wrapper}>
                    <div className={scss.working_view_card}>
                        <WorkerInfoCard
                            setErrors={setErrors}
                            halfScreen
                            worker={selectedWorker as IWorker}
                            workerDocs={selectedWorkerDocs as IWorkerDocs[]}
                        />
                    </div>
                    <div className={scss.working_view_table}>
                        <Table tableRows={sessionLog}>
                            <Column header="Работник" field="workerName" />
                            <Column header="Дата" field="date" />
                            <Column header="Тип" field="modeName" />
                        </Table>
                    </div>
                </div>
            )}
            {loading && <Spinner />}
        </div>
    );
};
