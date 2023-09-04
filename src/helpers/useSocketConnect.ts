import { useCallback, useEffect, useRef } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import UniversalCookies from 'universal-cookie';
import { getWorkerDocs } from 'http/workerApi';
import { useRouter } from 'next/navigation';

const cookie = new UniversalCookies();
type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    setWorker: (w: IWorker) => void;
    setWorkerDocs?: (d: IWorkerDocs[]) => void;
    sessionId: number;
    socket: WebSocket;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => void;

export const useSocketConnect: SocketConnectFunc = ({
    setWorker,
    setLoading,
    setWorkerDocs,
    sessionId,
    socket,
}) => {
    const router = useRouter();

    const onSocketSuccess = useCallback(
        async (data: SocketResponse) => {
            setLoading(true);
            setWorker(data.data.worker);
            await getWorkerDocs(data.data.worker.id)
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

            if (message.type === 'success') {
                onSocketSuccess(message);
            }
        };

        return () => {
            socket?.close();
        };
    }, [onSocketSuccess, sessionId]);
};
