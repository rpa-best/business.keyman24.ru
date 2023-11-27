'use client';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';
import {
    getOrganizationContractorsOnClient,
    updateOrg,
} from 'http/organizationApi';
import FileSaver from 'file-saver';
import { getWorkersPlan } from 'http/workerApi';
import { useEffect, useState } from 'react';
import { SelectOrgAndIntervalTippy } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy';
import { IOrganization } from 'store/types';
import { Spinner } from 'components/Spinner';

import scss from 'app/(Main)/workers/Worker.module.scss';

export const WorkersButton = () => {
    const [orgs, setOrgs] = useState<IOrganization[]>([]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const handleRefreshClick = async () => {
        await updateOrg();
    };

    useEffect(() => {
        const fetchOrgs = async () => {
            return await getOrganizationContractorsOnClient();
        };

        fetchOrgs().then((d) => setOrgs(d));
    }, []);

    return (
        <>
            <Button onClick={() => handleRefreshClick()} type="button">
                Обновить данные
            </Button>
            <div className={scss.buttons}>
                <Button onClick={() => setVisible(true)} type="button">
                    Загрузить работников
                </Button>
                <SelectOrgAndIntervalTippy orgs={orgs} />
            </div>
        </>
    );
};
