import { useCallback, useEffect, useState } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import UniversalCookies from 'universal-cookie';
import { getWorkerDocs } from 'http/workerApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const cookie = new UniversalCookies();
type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    setWorker: (w: IWorker) => void;
    setWorkerDocs?: (d: IWorkerDocs[]) => void;
    sessionId: number;
    socket: WebSocket;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => SocketResponse;

export const useSocketConnect: SocketConnectFunc = ({
    setWorker,
    setLoading,
    setWorkerDocs,
    sessionId,
    socket,
}) => {
    const router = useRouter();

    const [data, setData] = useState<SocketResponse>();

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            setLoading(true);
            setWorker(data.data.user as IWorker);
            setData(data);
            await getWorkerDocs(data.data.user.id)
                .then((d) => {
                    if (setWorkerDocs) {
                        setWorkerDocs(d.results);
                    }
                })
                .finally(() => {
                    router.refresh();
                    setLoading(false);
                });
        },
        [setLoading, setWorker, setWorkerDocs]
    );

    useEffect(() => {
        const access = cookie.get('access');
        socket = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${sessionId}/?token=${access}`
        );

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'error') {
                if (message.data.error.slug === 'worker_not_found') {
                    toast('Работник не найден', {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
                } else {
                    toast('Ошибка', {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
                }
            }

            if (message.type === 'success') {
                onSocketSuccess(message);
            }
        };

        return () => {
            socket?.close();
        };
    }, [onSocketSuccess, sessionId]);

    return data as SocketResponse;
};
