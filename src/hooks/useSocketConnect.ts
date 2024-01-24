import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import { getWorkerDocs } from 'http/workerApi';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { useSocketStore } from 'store/useSocketStore';
import revalidate from 'utils/revalidate';
import { errorToastOptions } from 'config/toastConfig';

type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    sessionId: number;
    areaId: number;
    disableSuccessFunc?: boolean;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => {
    worker: IWorker;
    workerDocs: IWorkerDocs[];
    confirmed: boolean;
    setConfirmed: Dispatch<SetStateAction<boolean>>;
    newWorker: boolean;
};

export const useSocketConnect: SocketConnectFunc = ({
    setLoading,
    sessionId,
    areaId,
    disableSuccessFunc,
}) => {
    const socketStore = useSocketStore((state) => state);

    const path = usePathname();

    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [worker, setWorker] = useState<IWorker>();

    const prevWorker = useRef<string | null>(null);

    const [newWorker, setNewWorker] = useState(false);

    const [confirmed, setConfirmed] = useState(false);

    const onSocketMessage = async (data: SocketResponse) => {
        if (!disableSuccessFunc) {
            if (data) {
                setLoading(true);
                setWorker(data.data.worker as IWorker);
                const workerDocs = await getWorkerDocs(
                    data.data.worker?.id
                ).finally(() => {
                    setLoading(false);
                });
                setWorkerDocs(workerDocs.results);
                if (prevWorker.current === data.data.user) {
                    setConfirmed(true);
                } else {
                    setNewWorker(!newWorker);
                }
                revalidate(path);
                prevWorker.current = data.data.user as string;
            }
        }
    };

    useEffect(() => {
        const { message } = socketStore;
        if (message?.type === 'error') {
            toast(message?.data.error?.name, errorToastOptions);
        }
        onSocketMessage(socketStore.message as SocketResponse);
    }, [areaId, sessionId, socketStore.message]);

    return {
        worker: worker as IWorker,
        workerDocs: workerDocs as IWorkerDocs[],
        confirmed,
        setConfirmed,
        newWorker,
    };
};
