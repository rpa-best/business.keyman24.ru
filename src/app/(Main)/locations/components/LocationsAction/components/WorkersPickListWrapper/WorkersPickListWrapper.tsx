'use client';

import React, { useEffect, useState } from 'react';

import {
    createLocationWorker,
    deleteLocationWorker,
    getLocationWorkersOnClient,
} from 'http/locationsApi';
import { PickList } from 'components/PickList';
import { WorkersPickListWrapperProps } from 'app/(Main)/locations/types';
import { DefaultElem } from 'components/PickList/types';
import { getWorkers } from 'http/workerApi';
import { v4 } from 'uuid';
import { IWorker } from 'http/types';
import { ModifiedWorker } from 'app/(Main)/locations/components/LocationsAction/components/types';
import { AxiosError } from 'axios';
import { useErrorBoundary } from 'react-error-boundary';

export const WorkersPickListWrapper: React.FC<WorkersPickListWrapperProps> = ({
    listsRefresh,
    locId,
    loading,
    setLoading,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<IWorker[]>([]);
    const [target, setTarget] = useState<ModifiedWorker[]>([]);

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const locationWorkers = await getLocationWorkersOnClient(
                locId
            ).catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        showBoundary('Недостаточно прав');
                    }
                }
            });

            if (!locationWorkers) {
                return;
            }

            const workers = await getWorkers().catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        showBoundary('Недостаточно прав');
                    }
                }
            });

            if (!workers) {
                return;
            }

            const filteredWorkers = workers.results.filter((w) => {
                return !locationWorkers.results.find(
                    (worker) => worker.worker.id === w.id
                );
            });
            const source = filteredWorkers.map((el) => {
                return { ...el, uuid: v4(), customDesc: el.org.name };
            });

            const target = locationWorkers.results.map((w) => {
                return {
                    ...w,
                    name: w.worker.name,
                    uuid: v4(),
                    customDesc: w.worker.org.name,
                };
            });

            return { source, target };
        };
        fetchData()
            .then((props) => {
                if (!props) {
                    return;
                }
                const { source, target } = props;
                setSource(source as []);
                setTarget(target);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [locId, refresh, listsRefresh]);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createLocationWorker({
                    location: locId,
                    worker: +el.id,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deleteLocationWorker(locId, +el.id);
            })
        );
    };

    return (
        <>
            <PickList
                sortByCustom
                hidden
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                available={source as []}
                selected={target as []}
                title="Настройки работников"
                setLoading={setLoading}
                loading={loading}
                setRefresh={setRefresh}
            />
        </>
    );
};
