'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import UniversalCookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { getSessionInfo, sendSessionAction } from 'http/workingAreaApi';
import {
    ModifiedRegisterLog,
    RegisterProps,
} from 'app/(Main)/working-areas/session/[slug]/open/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IOrganization } from 'store/types';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Spinner } from 'components/Spinner';
import { Button } from 'components/UI/Buttons/Button';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { AxiosError } from 'axios';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';
import revalidate from 'utils/revalidate';
import { errorToastOptions, successToastConfig } from 'config/toastConfig';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { onWorkerClick } from 'app/(Main)/working-areas/session/[slug]/helpers/onWorkerClick';
import { useSocketStore } from 'store/useSocketStore';
import { RangePicker } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/RangePicker';

import scss from './Register.module.scss';

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
    const [interval, setInterval] = useState<{
        from?: '';
        to?: '';
    }>({
        from: '',
        to: '',
    });
    const [refreshInterval, setRefreshInterval] = useState(false);

    const [workers, setWorkers] = useState<IWorker[]>([]);

    const [loading, setLoading] = useState(false);

    const [guestCount, setGuestCount] = useState(0);

    const socketStore = useSocketStore((state) => state);

    useEffect(() => {
        (async () => {
            const info = await getSessionInfo(currentAreaId, currentSessionId);
            setGuestCount(info.info.workerGuestNotCard);
        })();
    }, [currentAreaId, currentSessionId]);

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            setLoading(true);
            let body = {
                user: data.data.user as string,
                mode: data.data.mode,
                worker: selectedWorker?.id,
                device: data.data.device,
            } as any;
            if (selectedWorker?.guest) {
                if (interval?.from && interval?.to) {
                    body = {
                        ...body,
                        start_date: new Date(interval.from),
                        end_date: new Date(interval.to),
                    };
                }
            }
            toast.dismiss();
            sendSessionAction(currentAreaId, currentSessionId, body as any)
                .then((d) => {
                    const mode = d.mode ? 'Выдан' : 'Сдан';
                    const newLog = {
                        ...d,
                        modeName: mode,
                        workerName: d.worker.name,
                        inventoryName: `${d?.inventory?.id} ${d?.inventory?.name}`,
                        card: d.card,
                    };
                    setSessionLogData((log) => [newLog, ...log]);
                    revalidate(path);
                    revalidate(`/workers/${selectedWorker?.id}?which=card`);
                    toast('Успешно', successToastConfig);
                    setInterval({
                        from: '',
                        to: '',
                    });
                    setRefreshInterval(!refreshInterval);
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
        [interval, currentAreaId, currentSessionId, router, selectedWorker?.id]
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
    }, [currentAreaId, socketStore.socket]);

    useEffect(() => {
        return () => {
            if (socketStore.socket) {
                socketStore.closeConnection();
            }
        };
    }, []);

    useEffect(() => {
        socketStore.onClose(() => {
            router.replace(
                '/working-areas/session/register-' + getParamsId(params.slug)
            );
        });
    }, [currentAreaId, router, socketStore]);

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    useEffect(() => {
        const message = socketStore.message;

        if (message?.type === 'info') {
            setGuestCount(+message.data.worker_guest_not_card);
            return;
        }

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
        toast('Приложите карточку', {
            position: 'bottom-right',
            hideProgressBar: true,
            autoClose: false,
            type: 'warning',
            theme: 'colored',
        });
        fetchData()
            .then((d) => {
                setSelectedWorkerDocs(d.results);
            })
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
                <p className={scss.guest_description}>
                    Гостей без карт: <span>{guestCount}</span>
                </p>
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
                        autoComplete="off"
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
                            autoComplete="off"
                            listValues={workers}
                            placeholder="Выберите работника"
                            onChange={handleSelectWorker}
                            value={selectedWorker?.name ?? ''}
                            name="workers"
                        />
                    </div>
                )}
                {selectedWorker?.guest && (
                    <div>
                        <RangePicker
                            refresh={refreshInterval}
                            minDate={new Date()}
                            getRawDate
                            setDates={(v) => {
                                setInterval(v as any);
                            }}
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
                            <Column header="Карта" field="card" />
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
                    <Column header="Карта" field="card" />
                </Table>
            )}
            {loading && <Spinner />}
        </div>
    );
};
