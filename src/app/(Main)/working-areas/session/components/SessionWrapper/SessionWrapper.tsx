'use client';

import React, { useEffect, useState } from 'react';

import { Table } from 'components/Table';
import { SessionWrapperProps } from 'app/(Main)/working-areas/types';
import { Column } from 'components/Table/Column';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { AttachCard } from 'app/(Main)/working-areas/components/AttachCard';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';
import { ICreateSessionBody } from 'http/types';
import {
    closeSession,
    createSession,
    sendActivateSession,
} from 'http/workingAreaApi';
import { Spinner } from 'components/Spinner';
import { useUserStore } from 'store/userStore';
import { getParamsType } from 'app/(Main)/working-areas/helpers';
import { toast } from 'react-toastify';

import scss from './SessionWrapper.module.scss';

export const SessionWrapper: React.FC<SessionWrapperProps> = ({
    sessions,
    areaId,
    type,
}) => {
    const [loading, setLoading] = useState(false);
    const [user] = useUserStore((state) => [state.user]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [currentSession, setCurrentSession] = useState(
        sessions.find((s) => s.status === 'В процессе')?.id ?? null
    );

    const router = useRouter();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const startSessionDisabled = currentSession;

    const needAttach = type !== 'register';

    useEffect(() => {
        const sessionId = sessions.find((s) => s.status === 'В процессе')?.id;
        setCurrentSession(sessionId ?? null);
    }, [sessions]);

    const handleRowClick = (id: number) => {
        const session = sessions.find((s) => s.id === id);
        if (session?.status === 'Завершена') {
            router.push(`${pathname}/closed/${session.id}`);
        } else {
            if (!needAttach) {
                setLoading(true);
                sendActivateSession(areaId, currentSession as number)
                    .then(() => {
                        router.push(
                            `${pathname}/open/${currentSession as number}`
                        );
                    })
                    .catch((e) => {
                        toast('Ошибка', {
                            position: 'bottom-right',
                            hideProgressBar: true,
                            autoClose: 2000,
                            type: 'error',
                            theme: 'colored',
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                return;
            }
            setVisible(true);
        }
    };

    const onStartSessionClick = async () => {
        setLoading(true);
        needAttach && setVisible(true);

        let maxNumber = Math.max(...sessions.map((s) => s.id));
        maxNumber === -Infinity ? (maxNumber = 1) : '';

        const currentDate = `${new Date().toLocaleDateString(
            'ru'
        )} ${new Date().toLocaleTimeString('ru')} `;

        const body: ICreateSessionBody = {
            status: 1,
            number: sessions.length + 1,
            id: maxNumber + 1,
            start_date: currentDate,
            end_date: null,
            is_active: false,
            user: user?.username as string,
        };
        await createSession(areaId, body).then(() => {
            router.refresh();
            if (!needAttach) {
                sendActivateSession(areaId, maxNumber + 1)
                    .then(() => {
                        router.push(`${pathname}/open/${maxNumber + 1}`);
                    })
                    .catch((e) => {
                        toast('Ошибка', {
                            position: 'bottom-right',
                            hideProgressBar: true,
                            autoClose: 2000,
                            type: 'error',
                            theme: 'colored',
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                return;
            }
            setVisible(true);
        });
        setLoading(false);
    };

    const onCloseSessionClick = async () => {
        setLoading(true);
        await closeSession(areaId, currentSession as number);
        router.refresh();
        setLoading(false);
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
                    </div>
                    <div className={scss.buttons_wrapper}>
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
                    </div>
                </div>
            </div>
            <Table tableRows={sessions} handleRowClick={handleRowClick}>
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
