'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { closeSession } from 'http/workingAreaApi';
import { RegisterProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IOrganization } from 'store/types';
import { getWorkerDocs, getWorkers } from 'http/workerApi';
import { IWorker, IWorkerDocs } from 'http/types';
import { WorkerInfoCard } from 'app/(Main)/working-areas/session/[slug]/open/components/WorkerInfoCard/WorkerInfoCard';
import { Spinner } from 'components/Spinner';
import { Button } from 'components/UI/Buttons/Button';

import scss from './Register.module.scss';
import { closeSessionHandler } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';

export const Register: React.FC<RegisterProps> = ({
    organizations,
    currentSessionId,
    currentAreaId,
}) => {
    const router = useRouter();

    const [selectedOrg, setSelectedOrg] = useState<IOrganization>();
    const [selectedWorker, setSelectedWorker] = useState<IWorker>();
    const [selectedWorkerDocs, setSelectedWorkerDocs] =
        useState<IWorkerDocs[]>();
    const [workers, setWorkers] = useState<IWorker[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSelectOrg = (org: IOrganization) => {
        setLoading(true);
        setSelectedOrg(org);
        const fetchData = async () => {
            return await getWorkers(org.id);
        };
        fetchData()
            .then((d) => setWorkers(d.results))
            .finally(() => setLoading(false));
    };

    const onCloseSessionClick = async () => {
        await closeSessionHandler(
            setLoading,
            currentAreaId,
            currentSessionId,
            'register',
            router
        );
    };

    const handleSelectWorker = (worker: IWorker) => {
        setLoading(true);
        setSelectedWorker(worker);
        const fetchData = async () => {
            return await getWorkerDocs(worker.id, selectedOrg?.id as number);
        };
        fetchData()
            .then((d) => setSelectedWorkerDocs(d.results))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <div className={scss.button_wrapper}>
                <Button onClick={() => onCloseSessionClick()} type="button">
                    Завершить сессию
                </Button>
            </div>
            <div className={scss.inputs_wrapper}>
                <div>
                    <InputSelect
                        listValues={organizations}
                        placeholder="Выберите организацию"
                        onChange={handleSelectOrg}
                        value={selectedOrg?.name ?? ''}
                        name="organization"
                    />
                </div>
                {selectedOrg && (
                    <div>
                        <InputSelect
                            listValues={workers}
                            placeholder="Выберите работника"
                            onChange={handleSelectWorker}
                            value={selectedWorker?.name ?? ''}
                            name="workers"
                        />
                    </div>
                )}
            </div>
            {selectedOrg && selectedWorker && (
                <WorkerInfoCard
                    worker={selectedWorker}
                    workerDocs={selectedWorkerDocs as IWorkerDocs[]}
                />
            )}
            {loading && <Spinner />}
        </div>
    );
};
