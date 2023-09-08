import React, { useEffect, useRef } from 'react';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { sendActivateSession, sendCheck } from 'http/workingAreaApi';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useModalStore } from 'store/modalVisibleStore';
import UniversalCookies from 'universal-cookie';

import scss from './AttachCard.module.scss';
import { getParamsType } from 'app/(Main)/working-areas/helpers';

const cookie = new UniversalCookies();

interface AttachCardProps {
    user: string;
    session: number;
    areaId: number;
}

export const AttachCard: React.FC<AttachCardProps> = ({
    user,
    areaId,
    session,
}) => {
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

    const onSocketSuccess = async () => {
        const body = {
            user,
            session,
        };
        await sendCheck(areaId, session, body).then(() => {
            setVisible(false);
            if (socket.current) {
                socket.current?.close();
            }
            router.push(`${pathname}/open/${session}`);
        });
    };

    useEffect(() => {
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${session}/?token=${access}`
        );

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'success') {
                onSocketSuccess();
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
