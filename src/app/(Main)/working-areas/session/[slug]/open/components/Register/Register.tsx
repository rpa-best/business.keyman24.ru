'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import UniversalCookies from 'universal-cookie';
import { toast } from 'react-toastify';
import {
    sendActivateSession,
    sendCheck,
    sendSessionAction,
} from 'http/workingAreaApi';
import {
    ModifiedRegisterLog,
    RegisterProps,
} from 'app/(Main)/working-areas/session/[slug]/open/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IOrganization } from 'store/types';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import {
    IWorker,
    IWorkerDocs,
    SessionLogResponse,
    SocketResponse,
} from 'http/types';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Spinner } from 'components/Spinner';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { useModalStore } from 'store/modalVisibleStore';
import { Column } from 'components/Table/Column';

import scss from './Register.module.scss';
import { AxiosError } from 'axios';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';
import revalidate from 'utils/revalidate';
import { errorToastOptions, successToastConfig } from 'config/toastConfig';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { onWorkerClick } from 'app/(Main)/working-areas/session/[slug]/helpers/onWorkerClick';
import { useUserStore } from 'store/userStore';
import { useSocketStore } from 'store/useSocketStore';

const cookie = new UniversalCookies();

export const Register: React.FC<RegisterProps> = ({
    organizations,
    currentSessionId,
    currentAreaId,
    sessionLog,
    areaName,
    permissions,
}) => {
    const router = useRouter();
    const path = usePathname();
    const params = useParams();

    const itsRegisterInventory =
        getParamsType(params.slug) === 'register_inventory';

    const [sessionLogData, setSessionLogData] =
        useState<ModifiedRegisterLog[]>(sessionLog);

    const [selectedOrg, setSelectedOrg] = useState<IOrganization>();
    const [selectedWorker, setSelectedWorker] = useState<IWorker>();
    const [selectedWorkerDocs, setSelectedWorkerDocs] =
        useState<IWorkerDocs[]>();
    const [workers, setWorkers] = useState<IWorker[]>([]);

    const [loading, setLoading] = useState(false);

    const socketStore = useSocketStore((state) => state);

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
                .then((d) => {
                    const mode = d.mode ? 'Выдан' : 'Сдан';
                    const newLog = {
                        ...d,
                        modeName: mode,
                        workerName: d.worker.name,
                        inventoryName: `${d?.inventory?.id} ${d?.inventory?.name}`,
                    };
                    setSessionLogData((log) => [newLog, ...log]);
                    revalidate(path);
                    revalidate(`/workers/${selectedWorker?.id}?which=card`);
                    toast('Успешно', successToastConfig);
                })
                .catch((e: unknown) => {
                    if (e instanceof AxiosError) {
                        toast(
                            e.response?.data.error[0].name,
                            errorToastOptions
                        );
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [currentAreaId, currentSessionId, router, selectedWorker?.id]
    );

    const onMessage = useCallback(
        (message: SocketResponse) => {
            if (message.type === 'success') {
                if (selectedOrg && selectedWorker) {
                    onSocketSuccess(message);
                } else {
                    toast('Выберите локацию и организацию!', {
                        position: 'top-left',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
                }
            }
        },
        [onSocketSuccess, selectedOrg, selectedWorker]
    );

    useEffect(() => {
        if (!socketStore.socket) {
            router.replace(`/working-areas/session/register-${currentAreaId}`);
        }
        return () => {
            if (socketStore.socket) {
                socketStore.closeConnection();
            }
        };
    }, [currentAreaId, socketStore.socket]);

    useEffect(() => {
        socketStore.onClose(() => {
            router.replace(
                '/working-areas/session/register-' + getParamsId(params.slug)
            );
        });
    }, [currentAreaId, router, socketStore]);

    useEffect(() => {
        const message = socketStore.message;

        if (message) {
            onMessage(message);
        }
    }, [socketStore.message]);

    const handleSelectOrg = (org: IOrganization) => {
        setLoading(true);
        setSelectedOrg(org);
        const fetchData = async () => {
            return await getWorkers(org.id);
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
            'register-' + getParamsId(params.slug)
        );
        router.replace(
            '/working-areas/session/register-' + getParamsId(params.slug)
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

    const handleRowClick = async (id: number) => {
        if (itsRegisterInventory) {
            return;
        }
        const workerId = sessionLogData.find((el) => el.id === id)?.worker.id;
        await onWorkerClick(workerId as number);
    };

    return (
        <div>
            <div className={scss.page_title_with_table_back_button}>
                <h1>{areaName}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            {permissions.includes('DELETE') && (
                <div className={scss.button_wrapper}>
                    <Button onClick={() => onCloseSessionClick()} type="button">
                        Завершить сессию
                    </Button>
                </div>
            )}
            <div className={scss.inputs_wrapper}>
                <div>
                    <InputSelect
                        autoComplete="new-password"
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
                            autoComplete="new-password"
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
                            halfScreen
                            worker={selectedWorker as IWorker}
                            workerDocs={selectedWorkerDocs as IWorkerDocs[]}
                        />
                    </div>
                    <div className={scss.working_view_table}>
                        <Table
                            handleRowClick={handleRowClick}
                            tableData={sessionLogData}
                            setTableData={() => {}}
                        >
                            <Column header="Работник" field="workerName" />
                            <Column header="Дата" field="date" />
                            <Column header="Тип" field="modeName" />
                        </Table>
                    </div>
                </div>
            )}
            {!selectedWorker && (
                <Table
                    handleRowClick={handleRowClick}
                    tableData={sessionLogData}
                    setTableData={() => {}}
                >
                    <Column header="Работник" field="workerName" />
                    <Column header="Дата" field="date" />
                    <Column header="Тип" field="modeName" />
                </Table>
            )}
            {loading && <Spinner />}
        </div>
    );
};
