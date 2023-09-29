import React, { useEffect, useRef } from 'react';

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

const cookie = new UniversalCookies();

interface AttachCardProps {
    user: string;
    session: number;
    areaId: number;
}

export const AttachCard: React.FC<AttachCardProps> = ({ areaId, session }) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const access = cookie.get('access');
    const socket = useRef<WebSocket>();

    const router = useRouter();

    const pathname = usePathname();
    const params = useParams();

    useEffect(() => {
        if (getParamsType(params.slug) === 'security') {
            sendActivateSession(areaId, session);
        }
    }, [areaId, params.slug, session]);

    const onSocketSuccess = async (data: SocketResponse) => {
        if (!data.data.user.user) {
            toast('Нет доступа к сессии', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'error',
                theme: 'colored',
            });
        }
        const body = {
            user: data.data.user.user as string,
            session,
        };
        await sendCheck(areaId, session, body)
            .then(() => {
                setVisible(false);
                if (socket.current) {
                    socket.current?.close();
                }
                router.push(`${pathname}/open/${session}`);
            })
            .catch((e: unknown) => {
                if (e instanceof AxiosError) {
                    if (
                        e.response?.data.user[0].slug === 'not_perm_to_session'
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
    };

    useEffect(() => {
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${session}/?token=${access}`
        );

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'success') {
                onSocketSuccess(message);
            }
        };

        return () => {
            socket.current?.close();
        };
    }, [access, onSocketSuccess, session]);

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
