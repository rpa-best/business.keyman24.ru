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

export const WorkersPickListWrapper: React.FC<WorkersPickListWrapperProps> = ({
    listsRefresh,
    locId,
    loading,
    setLoading,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<IWorker[]>([]);
    const [target, setTarget] = useState<ModifiedWorker[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const locationWorkers = await getLocationWorkersOnClient(locId);

            const workers = await getWorkers();

            const filteredWorkers = workers.results.filter((w) => {
                return !locationWorkers.results.find(
                    (worker) => worker.worker.id === w.id
                );
            });

            const source = filteredWorkers.map((el) => {
                return { ...el, uuid: v4() };
            });

            const target = locationWorkers.results.map((w) => {
                return { ...w, name: w.worker.name, uuid: v4() };
            });

            return { source, target };
        };
        fetchData()
            .then(({ source, target }) => {
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
