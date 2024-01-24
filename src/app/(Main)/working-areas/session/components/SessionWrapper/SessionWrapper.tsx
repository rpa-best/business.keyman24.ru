'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'universal-cookie';

import { SessionWrapperProps } from 'app/(Main)/working-areas/types';
import { ICreateSessionBody, IModifiedSession } from 'http/types';

import { useModalStore } from 'store/modalVisibleStore';
import { useUserStore } from 'store/userStore';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { Modal } from 'components/Modal';
import { AttachCard } from 'app/(Main)/working-areas/components/AttachCard';
import { Spinner } from 'components/Spinner';
import { Button } from 'components/UI/Buttons/Button';

import { checkAccess } from 'utils/checkAccess';
import {
    closeSession,
    createSession,
    sendActivateSession,
    sendCheck,
} from 'http/workingAreaApi';
import revalidate from 'utils/revalidate';
import { DateHelper } from 'utils/dateHelper';
import { toast } from 'react-toastify';
import { errorToastOptions, warningToastConfig } from 'config/toastConfig';
import { useSocketStore } from 'store/useSocketStore';

import scss from './SessionWrapper.module.scss';
import { AxiosError } from 'axios';
import { sendActivateAndCheck } from 'app/(Main)/working-areas/session/[slug]/open/utils';

const cookie = new Cookies();

export const SessionWrapper: React.FC<SessionWrapperProps> = ({
    sessions,
    areaId,
    type,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const socketStore = useSocketStore((state) => state);

    const [sessionsData, setSessionsData] = useState<IModifiedSession[]>(
        sessions.results
    );

    const [user] = useUserStore((state) => [state.user]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [loading, setLoading] = useState(false);

    const currentSession = useMemo(() => {
        return sessionsData.find((s) => s.status === 'В процессе')?.id ?? null;
    }, [sessionsData]);

    const startSessionDisabled = currentSession;

    const needAttach = type !== 'register' && type !== 'register_inventory';

    useEffect(() => {
        setSessionsData(sessions.results);
    }, [sessions]);

    useEffect(() => {
        router.prefetch(`${pathname}/open/${currentSession as number}`);
    }, [currentSession]);

    useEffect(() => {
        router.prefetch(`${pathname}/?archive=true`);
    }, [pathname]);

    const handleRowClick = async (id: number) => {
        const sessionId = id;
        const session = sessions.results.find((s) => s.id === id);
        const orgId = cookie.get('orgId');

        const accessed = await checkAccess(
            `business/${orgId}/working_area/${areaId}/session/${session?.id}/element?limit=1&offset=0`
        );
        if (accessed) {
            if (session?.status === 'Завершена') {
                router.push(`${pathname}/closed/${session.id}`);
            } else {
                if (!needAttach) {
                    const access = cookie.get('access');
                    sendActivateAndCheck(
                        sessionId,
                        areaId,
                        user?.username
                    ).then(() => {
                        socketStore.createConnection(sessionId, access);
                        router.push(`${pathname}/open/${sessionId}`);
                    });
                    return;
                }
                sendActivateSession(areaId, sessionId)
                    .then(() => {
                        const access = cookie.get('access');
                        socketStore.createConnection(sessionId, access);
                    })
                    .catch((e: unknown) => {
                        if (e instanceof AxiosError) {
                            if (e.response?.data.error) {
                                toast(
                                    e.response?.data.error[0].name,
                                    errorToastOptions
                                );
                            }
                            if (e.response?.data.user) {
                                toast(
                                    e.response?.data.user[0].name,
                                    errorToastOptions
                                );
                            }
                        }
                    });
                setVisible(true);
            }
        } else {
            toast('Недостаточно прав', warningToastConfig);
        }
    };

    const onStartSessionClick = async () => {
        setLoading(true);
        needAttach && setVisible(true);

        const currentDate = `${new Date().toLocaleDateString(
            'ru'
        )} ${new Date().toLocaleTimeString('ru')} `;

        const body: ICreateSessionBody = {
            status: 1,
            number: sessions.results.length + 1,
            start_date: currentDate,
            end_date: null,
            is_active: false,
            user: user?.username as string,
        };

        await createSession(areaId, body)
            .then((d) => {
                const startDate = new DateHelper(d.startDate);
                const endDate = new DateHelper(d.endDate ?? '');

                const newSession =
                    d.status === 1
                        ? {
                              ...d,
                              status: 'В процессе',
                              startDate: `${startDate.getDate} в ${startDate.getTime}`,
                              endDate: '-',
                          }
                        : {
                              ...d,
                              status: 'Завершена',
                              startDate: `${startDate.getDate} в ${startDate.getTime}`,
                              endDate: `${endDate.getDate} в ${endDate.getTime}`,
                          };

                setSessionsData((d) => [newSession, ...d]);

                router.prefetch(`${pathname}/open/${newSession.id}`);
                revalidate(pathname);

                const access = cookie.get('access');

                const session = d.id;

                if (!needAttach) {
                    sendActivateAndCheck(session, areaId, user?.username).then(
                        () => {
                            socketStore.createConnection(session, access);
                            router.push(`${pathname}/open/${newSession.id}`);
                        }
                    );
                    return;
                }

                sendActivateSession(areaId, session)
                    .then(() => {
                        socketStore.createConnection(session, access);
                    })
                    .catch((e: unknown) => {
                        if (e instanceof AxiosError) {
                            toast(
                                e.response?.data.user[0].name,
                                errorToastOptions
                            );
                        }
                    });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onCloseSessionClick = async () => {
        setLoading(true);
        await closeSession(areaId, currentSession as number)
            .then(() => {
                revalidate(pathname);
                setSessionsData((d) =>
                    d.map((el) => {
                        const d = new Date();
                        if (el.id === currentSession) {
                            return {
                                ...el,
                                status: 'Завершена',
                                endDate: `${d.getDate()}.${
                                    d.getMonth() + 1
                                } в ${d.getHours()}:${d.getMinutes()}`,
                            };
                        }
                        return el;
                    })
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onArchiveClick = () => {
        if (searchParams.get('archive')) {
            router.replace(pathname);
        } else {
            router.replace(`${pathname}/?archive=true`);
        }
    };

    return (
        <>
            <div className={scss.buttons_layout}>
                <div className={scss.buttons}>
                    <div>
                        <Button
                            active={!!searchParams.get('archive')}
                            onClick={() => onArchiveClick()}
                            type="button"
                        >
                            {searchParams.get('archive')
                                ? 'Выйти из архива'
                                : 'Посмотреть архив'}
                        </Button>
                        <Link href={pathname + '/error-log'}>
                            <Button onClick={() => {}} type="button">
                                Лог ошибок
                            </Button>
                        </Link>
                    </div>
                    <div className={scss.buttons_wrapper}>
                        {sessions.permissions.includes('POST') && (
                            <Button
                                disabled={
                                    !!searchParams.get('archive') ||
                                    !!startSessionDisabled
                                }
                                nowrap
                                onClick={onStartSessionClick}
                                type="button"
                            >
                                Начать сессию
                            </Button>
                        )}
                        {sessions.permissions.includes('DELETE') && (
                            <Button
                                disabled={
                                    !!searchParams.get('archive') ||
                                    !startSessionDisabled
                                }
                                nowrap
                                onClick={onCloseSessionClick}
                                type="button"
                            >
                                Завершить сессию
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Table
                tableData={sessionsData}
                setTableData={() => {}}
                paginatorData={{ offset: 25, countItems: sessions.count }}
                handleRowClick={handleRowClick}
            >
                <Column header="Дата начала" field="startDate" />
                <Column header="Дата окончания" field="endDate" />
                <Column header="Статус" field="status" />
            </Table>
            <Modal>
                <AttachCard
                    user={user?.username as string}
                    session={currentSession as number}
                    areaId={areaId}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
