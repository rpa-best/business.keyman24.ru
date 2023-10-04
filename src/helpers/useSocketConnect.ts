import { useCallback, useEffect, useState } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import UniversalCookies from 'universal-cookie';
import { getWorkerDocs } from 'http/workerApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';

const cookie = new UniversalCookies();
type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    sessionId: number;
    socket: WebSocket;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => {
    data: SocketResponse;
    worker: IWorker;
    workerDocs: IWorkerDocs[];
    errors: boolean;
};

export const useSocketConnect: SocketConnectFunc = ({
    setLoading,
    sessionId,
    socket,
}) => {
    const router = useRouter();

    const [errors, setErrors] = useState<boolean>(false);
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [worker, setWorker] = useState<IWorker>();

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
                    d.results.forEach((doc) => {
                        if (validateDate(doc.activeTo)) {
                            setErrors(true);
                        }
                    });
                })
                .finally(() => {
                    router.refresh();
                    setLoading(false);
                });
        },
        [setLoading]
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

    return {
        data: data as SocketResponse,
        worker: worker as IWorker,
        workerDocs: workerDocs as IWorkerDocs[],
        errors,
    };
};
