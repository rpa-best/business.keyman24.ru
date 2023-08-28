'use client';

import React, { useState } from 'react';

import { Table } from 'components/Table';
import { SessionWrapperProps } from 'app/(Main)/working-areas/types';
import { Column } from 'components/Table/Column';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { AttachCard } from 'app/(Main)/working-areas/components/AttachCard';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';
import { ICreateSessionBody } from 'http/types';
import { closeSession, createSession } from 'http/workingAreaApi';

import scss from './SessionWrapper.module.scss';
import { useUserStore } from 'store/userStore';
import { Spinner } from 'components/Spinner';

export const SessionWrapper: React.FC<SessionWrapperProps> = ({
    sessions,
    areaId,
    type,
}) => {
    const [loading, setLoading] = useState(false);
    const [user] = useUserStore((state) => [state.user]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const pathname = usePathname();
    const router = useRouter();

    const currentSession = sessions.find((s) => s.status === 'В процессе');

    const startSessionDisabled = currentSession;

    const needAttach = type !== 'register';

    const handleRowClick = (id: number) => {
        const session = sessions.find((s) => s.id === id);
        if (session?.status === 'Завершена') {
            router.push(`${pathname}/closed/${session.id}`);
        } else {
            router.push(`${pathname}/open/${session?.id}`);
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
        await createSession(areaId, body).then(() => setVisible(false));
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
                <AttachCard />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
