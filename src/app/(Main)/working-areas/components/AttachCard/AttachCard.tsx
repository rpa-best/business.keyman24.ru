import React, { useEffect, useRef } from 'react';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { sendCheck } from 'http/workingAreaApi';
import { usePathname, useRouter } from 'next/navigation';
import { useModalStore } from 'store/modalVisibleStore';
import UniversalCookies from 'universal-cookie';

import scss from './AttachCard.module.scss';

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

    const onSocketSuccess = async () => {
        const body = {
            user,
            session,
        };
        await sendCheck(areaId, session, body).then(() => {
            router.push(`${pathname}/open/${session}`);
            if (socket.current) {
                socket.current?.close();
            }
            setVisible(false);
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
