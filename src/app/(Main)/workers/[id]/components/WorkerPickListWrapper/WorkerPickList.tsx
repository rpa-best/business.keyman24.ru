'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { PickList } from 'components/PickList';
import { Spinner } from 'components/Spinner';
import { DefaultElem } from 'components/PickList/types';
import {
    CustomDefaultElem,
    WorkerPickListPermissionsWrapper,
} from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper/types';
import {
    createWorkerPermission,
    deleteWorkerPermission,
} from 'http/permissionsApi';

export const WorkersPermissionsPickList: React.FC<
    WorkerPickListPermissionsWrapper
> = ({ target, source, workerUsername }) => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleArrowRight = async (elems: CustomDefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createWorkerPermission({
                    user: workerUsername,
                    permission: +el.id,
                    type: el.type,
                });
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await deleteWorkerPermission(workerUsername, el.id);
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    return (
        <>
            <PickList
                hidden={true}
                visibile={false}
                handleArrowLeft={handleArrowLeft}
                handleArrowRight={handleArrowRight as any}
                available={source}
                selected={target}
                title="Настройки прав пользователя"
            />
            {loading && <Spinner />}
        </>
    );
};
