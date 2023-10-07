'use server';

import React from 'react';

import {
    getServerWorkerDocs,
    getWorker,
    getWorkerCard,
    getWorkerPlan,
} from 'http/workerApi';
import { cookies } from 'next/headers';
import { WorkerTables } from 'app/(Main)/workers/[id]/components/WorkerTables';

import scss from './WorkerDocsTable.module.scss';

interface WorkerDocsTableProps {
    id: string;
}

export const WorkerDocsTable: React.FC<WorkerDocsTableProps> = async ({
    id,
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const worker = await getWorker(+orgId, +id);

    const workerDocs = await getServerWorkerDocs(+id, +orgId);

    const docs = workerDocs.results.map((w) => {
        const activeTo = new Date(w.activeTo);

        const activeFrom = new Date(w.activeFrom);

        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        const formattedActiveTo = activeTo.toLocaleDateString(
            'ru-RU',
            options as any
        );
        const formattedActiveFrom = activeFrom.toLocaleDateString(
            'ru-RU',
            options as any
        );

        return {
            ...w,
            activeTo: formattedActiveTo,
            activeFrom: formattedActiveFrom,
        };
    });

    const cards = await getWorkerCard(+orgId, +id);

    const time = await getWorkerPlan(+orgId, +id);

    const workerInventory = worker.inventories.map((i) => {
        return { ...i, type: i.type.name };
    });

    return (
        <div className={scss.info_wrapper}>
            <WorkerTables
                cards={cards.results}
                docs={docs}
                workerInventory={workerInventory as any}
                time={time}
            />
        </div>
    );
};
