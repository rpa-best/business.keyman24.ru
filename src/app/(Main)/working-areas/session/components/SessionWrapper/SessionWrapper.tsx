'use client';

import React, { useState } from 'react';

import { Table } from 'components/Table';
import { SessionWrapperProps } from 'app/(Main)/working-areas/types';
import { Column } from 'components/Table/Column';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { AttachCard } from 'app/(Main)/working-areas/components/AttachCard';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';
import { ICreateSessionBody } from 'http/types';
import { closeSession, createSession } from 'http/workingAreaApi';
import { Spinner } from 'components/Spinner';
import { useUserStore } from 'store/userStore';

import scss from './SessionWrapper.module.scss';

export const SessionWrapper: React.FC<SessionWrapperProps> = ({
    sessions,
    areaId,
    type,
}) => {
    const [loading, setLoading] = useState(false);
    const [user] = useUserStore((state) => [state.user]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const router = useRouter();

    const params = useParams();
    const pathname = usePathname();

    const currentSession = sessions.find((s) => s.status === 'В процессе');

    const startSessionDisabled = currentSession;

    const needAttach = type !== 'register';

    const handleRowClick = (id: number) => {
        const session = sessions.find((s) => s.id === id);
        if (session?.status === 'Завершена') {
            router.push(`${pathname}/closed/${session.id}`);
        } else {
            if (!needAttach) {
                router.push(`${pathname}/open/${session?.id}`);
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
        await createSession(areaId, body)
            .then(() => setVisible(false))
            .then(() => {
                if (params.slug === 'register') {
                    router.push(`${pathname}/open/${maxNumber + 1}`);
                    return;
                }
                setVisible(true);
            });
        router.refresh();
        setLoading(false);
    };

    const onCloseSessionClick = async () => {
        setLoading(true);
        await closeSession(areaId, currentSession?.id as number);
        router.refresh();
        setLoading(false);
    };

    return (
        <>
            <div className={scss.buttons_layout}>
                <div className={scss.buttons}>
                    <Button
                        disabled={!!startSessionDisabled}
                        nowrap
                        onClick={onStartSessionClick}
                        type="button"
                    >
                        Начать сессию
                    </Button>
                    <Button
                        disabled={!startSessionDisabled}
                        nowrap
                        onClick={onCloseSessionClick}
                        type="button"
                    >
                        Завершить сессию
                    </Button>
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
                    session={currentSession?.id as number}
                    areaId={areaId}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
