import React, { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { AttachCardProps } from 'app/(Main)/working-areas/components/AttachCard/types';
import { SocketResponse } from 'http/types';
import { sendActivateSession, sendCheck } from 'http/workingAreaApi';

import { getParamsType } from 'app/(Main)/working-areas/helpers';
import { useModalStore } from 'store/modalVisibleStore';
import { useSocketStore } from 'store/useSocketStore';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';

import scss from './AttachCard.module.scss';
import { errorToastOptions } from 'config/toastConfig';

const cookie = new Cookies();

export const AttachCard: React.FC<AttachCardProps> = ({ areaId, session }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const socketStore = useSocketStore((state) => state);
    const [isSuccess, setIsSuccess] = useState(false);
    const [visible] = useModalStore((state) => [state.visible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        if (!session || !session.toString()) {
            return;
        }
        const access = cookie.get('access');
        if (getParamsType(params.slug) === 'security') {
            sendActivateSession(areaId, session).then(() => {
                if (visible && !isSuccess) {
                    socketStore.createConnection(session, access);
                }
                if (!visible && !isSuccess) {
                    socketStore.closeConnection();
                }
            });
        } else {
            if (visible && !isSuccess) {
                socketStore.createConnection(session, access);
            }
            if (!visible && !isSuccess) {
                socketStore.closeConnection();
            }
        }
    }, [areaId, params.slug, session, visible, isSuccess]);

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            // @ts-ignore
            if (!data.data.user.user) {
                toast('Нет доступа к сессии', errorToastOptions);
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
                            toast('Нет доступа к сессии', errorToastOptions);
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
