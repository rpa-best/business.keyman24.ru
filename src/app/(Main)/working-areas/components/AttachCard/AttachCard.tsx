import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { sendActivateSession, sendCheck } from 'http/workingAreaApi';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useModalStore } from 'store/modalVisibleStore';
import UniversalCookies from 'universal-cookie';

import scss from './AttachCard.module.scss';
import { getParamsType } from 'app/(Main)/working-areas/helpers';
import { SocketResponse } from 'http/types';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useSocketConnect } from 'helpers/useSocketConnect';

const cookie = new UniversalCookies();

interface AttachCardProps {
    user: string;
    session: number;
    areaId: number;
}

export const AttachCard: React.FC<AttachCardProps> = ({ areaId, session }) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const pathname = usePathname();
    const params = useParams();

    useEffect(() => {
        if (getParamsType(params.slug) === 'security') {
            sendActivateSession(areaId, session);
        }
    }, [areaId, params.slug, session]);

    const { data } = useSocketConnect({
        sessionId: session,
        setLoading,
        areaId: areaId,
    });

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
        if (!data) {
            return;
        }
        onSocketSuccess(data);
    }, [data, onSocketSuccess]);

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
