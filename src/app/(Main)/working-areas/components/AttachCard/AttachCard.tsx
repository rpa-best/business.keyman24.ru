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
import { useUserStore } from 'store/userStore';

const cookie = new Cookies();

export const AttachCard: React.FC<AttachCardProps> = ({ areaId, session }) => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    const [user] = useUserStore((state) => [state.user]);
    const socketStore = useSocketStore((state) => state);
    const [isSuccess, setIsSuccess] = useState(false);
    const [visible] = useModalStore((state) => [state.visible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        if (!session || !session.toString()) {
            return;
        }
        if (!visible && !isSuccess) {
            socketStore.closeConnection();
        }
    }, [areaId, params.slug, session, visible, isSuccess]);

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            // @ts-ignore
            if (!data.data.user.user) {
                toast('Нет доступа к сессии', errorToastOptions);
                return;
            }
            const body = {
                user: user?.username as string,
                session,
            };
            sendCheck(areaId, session, body)
                .then(() => {
                    setVisible(false);
                    setIsSuccess(true);
                    router.push(`${pathname}/open/${session}`);
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
        },
        [areaId, pathname, session]
    );

    useEffect(() => {
        if (!socketStore.message) {
            return;
        }
        if (socketStore.message.type === 'error') {
            toast(socketStore.message.data.error.name, errorToastOptions);
            return;
        }
        onSocketSuccess(socketStore.message);
    }, [socketStore.message]);

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
