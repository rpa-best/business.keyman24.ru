'use client';

import React, { useEffect, useState } from 'react';

import { RegisterProps } from 'app/(Main)/working-areas/session/[slug]/open/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { IOrganization } from 'store/types';

import scss from './Register.module.scss';
import { getWorkers } from 'http/workerApi';
import { IWorker } from 'http/types';

export const Register: React.FC<RegisterProps> = ({ organizations }) => {
    const [selectedOrg, setSelectedOrg] = useState<IOrganization>();
    const [selectedWorker, setSelectedWorker] = useState<IWorker>();
    const [workers, setWorkers] = useState<IWorker[]>([]);

    const handleSelectOrg = (org: IOrganization) => {
        setSelectedOrg(org);
        const fetchData = async () => {
            return await getWorkers(org.id);
        };
        fetchData().then((d) => setWorkers(d.results));
    };

    return (
        <div>
            <form>
                <InputSelect
                    listValues={organizations}
                    placeholder="Выберите организацию"
                    onChange={handleSelectOrg}
                    value={selectedOrg?.name ?? ''}
                    name="organization"
                />
                <InputSelect
                    listValues={workers}
                    placeholder="Выберите работника"
                    onChange={(worker) => setSelectedWorker(worker)}
                    value={selectedWorker?.name ?? ''}
                    name="workers"
                />
            </form>
        </div>
    );
};
