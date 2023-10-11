import { useEffect, useState } from 'react';
import { IWorker, IWorkerDocs, SocketResponse } from 'http/types';
import { getWorkerDocs } from 'http/workerApi';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { useSocketStore } from 'store/useSocketStore';
import Cookies from 'universal-cookie';
import revalidate from 'utils/revalidate';

const cookie = new Cookies();

type UseSocketConnectProps = {
    setLoading: (b: boolean) => void;
    sessionId: number;
    areaId: number;
    disableSuccessFunc?: boolean;
};

type SocketConnectFunc = (props: UseSocketConnectProps) => {
    worker: IWorker;
    workerDocs: IWorkerDocs[];
    errors: boolean;
};

export const useSocketConnect: SocketConnectFunc = ({
    setLoading,
    sessionId,
    areaId,
    disableSuccessFunc,
}) => {
    const socketStore = useSocketStore((state) => state);

    const path = usePathname();

    const [errors, setErrors] = useState<boolean>(false);
    const [workerDocs, setWorkerDocs] = useState<IWorkerDocs[]>();
    const [worker, setWorker] = useState<IWorker>();

    const onSocketSuccess = async (data: SocketResponse) => {
        if (!disableSuccessFunc) {
            if (data) {
                setLoading(true);
                setWorker(data.data.worker as IWorker);
                await getWorkerDocs(data.data.worker?.id)
                    .then((d) => {
                        revalidate(path);
                        setWorkerDocs(d.results);
                        d.results.forEach((doc) => {
                            if (validateDate(doc.activeTo)) {
                                setErrors(true);
                            }
                        });
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
            if (message?.data.error.slug === 'worker_not_found') {
                toast('Работник не найден', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                    theme: 'colored',
                });
            } else if (
                message?.data.error.slug === 'worker_already_in_location'
            ) {
                toast('Работник уже в локации', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                    theme: 'colored',
                });
            } else if (message.data.error.slug === 'worker_not_in_location') {
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
    }, [socketStore.message]);

    useEffect(() => {
        if (socketStore.message?.type === 'success') {
            onSocketSuccess(socketStore.message);
        }
    }, [areaId, sessionId, socketStore.message]);

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
        worker: worker as IWorker,
        workerDocs: workerDocs as IWorkerDocs[],
        errors,
    };
};
