import { useEffect, useState } from 'react';
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

    const onSocketMessage = async (data: SocketResponse) => {
        if (!disableSuccessFunc) {
            if (data) {
                setLoading(true);
                setWorker(data.data.worker as IWorker);
                await getWorkerDocs(data.data.worker?.id)
                    .then((d) => {
                        revalidate(path);
                        setWorkerDocs(d.results);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
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
    };
};
