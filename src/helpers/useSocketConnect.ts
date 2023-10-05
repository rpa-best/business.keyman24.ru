import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import UniversalCookies from 'universal-cookie';
import { getWorkerDocs } from 'http/workerApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { useModalStore } from 'store/modalVisibleStore';

const cookie = new UniversalCookies();

type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    sessionId: number;
    areaId: number;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => {
    data: SocketResponse;
    worker: IWorker;
    workerDocs: IWorkerDocs[];
    errors: boolean;
    socketClose: () => void;
};

export const useSocketConnect: SocketConnectFunc = ({
    setLoading,
    sessionId,
    areaId,
}) => {
    const socket = useRef<WebSocket>();

    const router = useRouter();

    const [errors, setErrors] = useState<boolean>(false);
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [worker, setWorker] = useState<IWorker>();

    const [data, setData] = useState<SocketResponse>();

    const socketClose = () => {
        socket.current?.close();
    };

    const onSocketSuccess = async (data: SocketResponse) => {
        if (data) {
            setLoading(true);
            setWorker(data.data.worker as IWorker);
            setData(data);
            await getWorkerDocs(data.data.worker.id)
                .then((d) => {
                    setWorkerDocs(d.results);
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
        }
    };

    useEffect(() => {
        if (data?.type === 'error') {
            if (data?.data.error.slug === 'worker_not_found') {
                toast('Работник не найден', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                    theme: 'colored',
                });
            } else if (data?.data.error.slug === 'worker_already_in_location') {
                toast('Работник уже в локации', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                    theme: 'colored',
                });
            } else if (data.data.error.slug === 'worker_not_in_location') {
                toast('Работник не в локации', {
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
    }, [data]);

    useEffect(() => {
        const access = cookie.get('access');
        if (socket.current) {
            return;
        }
        socket.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_API_SOCKET_URL}business/ws/session/${sessionId}/?token=${access}`
        );

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            setData(message);

            if (message.type === 'success') {
                onSocketSuccess(message);
            }
        };
    }, [areaId, sessionId]);

    useEffect(() => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.close();
        }
    }, [areaId]);

    useEffect(() => {
        if (errors) {
            toast('Документы просрочены', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'error',
                theme: 'colored',
            });
        }
    }, [errors]);

    return {
        data: data as SocketResponse,
        worker: worker as IWorker,
        workerDocs: workerDocs as IWorkerDocs[],
        errors,
        socketClose,
    };
};
