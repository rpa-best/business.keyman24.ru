import React, { useCallback, useEffect, useState } from 'react';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { sendActivateSession, sendCheck } from 'http/workingAreaApi';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useModalStore } from 'store/modalVisibleStore';
import { getParamsType } from 'app/(Main)/working-areas/helpers';
import { SocketResponse } from 'http/types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useSocketStore } from 'store/useSocketStore';
import Cookies from 'universal-cookie';

import scss from './AttachCard.module.scss';

const cookie = new Cookies();

interface AttachCardProps {
    user: string;
    session: number;
    areaId: number;
}

export const AttachCard: React.FC<AttachCardProps> = ({ areaId, session }) => {
    const socketStore = useSocketStore((state) => state);
    const [isSuccess, setIsSuccess] = useState(false);
    const [visible] = useModalStore((state) => [state.visible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const router = useRouter();

    const pathname = usePathname();
    const params = useParams();

    useEffect(() => {
        if (!session || !session.toString()) {
            return;
        }
        if (getParamsType(params.slug) === 'security') {
            sendActivateSession(areaId, session);
        }
    }, [areaId, params.slug, session]);

    useEffect(() => {
        if (!session || !session.toString()) {
            return;
        }
        const access = cookie.get('access');
        if (visible && !isSuccess) {
            socketStore.createConnection(session, access);
        }
        if (!visible && !isSuccess) {
            socketStore.closeConnection();
        }
    }, [visible, isSuccess, session]);

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            // @ts-ignore
            if (!data.data.user.user) {
                toast('Нет доступа к сессии', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                    theme: 'colored',
                });
                return;
            }
            setIsSuccess(true);
            const body = {
                // @ts-ignore
                user: data.data.user.user as string,
                session,
            };
            await sendCheck(areaId, session, body)
                .then(() => {
                    setVisible(false);
                    router.push(`${pathname}/open/${session}`);
                })
                .catch((e: unknown) => {
                    if (e instanceof AxiosError) {
                        if (
                            e.response?.data.user[0].slug ===
                            'not_perm_to_session'
                        ) {
                            toast('Нет доступа к сессии', {
                                position: 'bottom-right',
                                hideProgressBar: true,
                                autoClose: 2000,
                                type: 'error',
                                theme: 'colored',
                            });
                        }
                    }
                });
        },
        [areaId, pathname, session]
    );

    useEffect(() => {
        if (!socketStore.message) {
            return;
        }
        onSocketSuccess(socketStore.message);
    }, [socketStore.message, onSocketSuccess]);

    return (
        <div>
            <h2 className={scss.spinner_header}>
                Приложите карту к устройству
            </h2>
            <div className={scss.spinner_layout}>
                <SpinnerFit />
            </div>
        </div>
    );
};
