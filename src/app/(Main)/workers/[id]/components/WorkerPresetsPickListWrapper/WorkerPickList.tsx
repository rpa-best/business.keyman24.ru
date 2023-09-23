'use client';

import React from 'react';

import { PickList } from 'components/PickList';

import { useRouter } from 'next/navigation';

import {
    createWorkerGroupUser,
    deleteWorkerGroupUser,
} from 'http/permissionsApi';
import { WorkerPresetPermValues } from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper/types';
import { DefaultElem } from 'components/PickList/types';

export const WorkerGroupPickList: React.FC<WorkerPresetPermValues> = ({
    target,
    workerUsername,
    source,
}) => {
    const router = useRouter();

    const handleArrowRight = async (elems: DefaultElem[]) => {
        await Promise.all(
            elems.map(async (el) => {
                await createWorkerGroupUser(workerUsername, { group: +el.id });
            })
        ).finally(() => {
            router.refresh();
        });
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        await Promise.all(
            elems.map((el) => {
                deleteWorkerGroupUser(workerUsername, +el.id);
            })
        ).finally(() => {
            router.refresh();
        });
    };

    return (
        <>
            <PickList
                visibile={false}
                hidden
                title="Настройка группы прав"
                available={source}
                selected={target}
                handleArrowLeft={handleArrowLeft}
                handleArrowRight={handleArrowRight}
            />
        </>
    );
};
