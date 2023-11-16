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
    searchParams: { which: 'docs' | 'inventory' | 'card' | 'time' };
}

export const WorkerDocsTable: React.FC<WorkerDocsTableProps> = async ({
    id,
    searchParams,
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const worker = await getWorker(+orgId, +id);

    const workerDocs =
        searchParams.which === 'docs'
            ? await getServerWorkerDocs(+id, +orgId)
            : null;

    let docs = null;

    if (workerDocs) {
        docs = workerDocs.results.map((w) => {
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
                formattedActiveTo,
                formattedActiveFrom,
            };
        });
    }

    const cards =
        searchParams.which === 'card' ? await getWorkerCard(+orgId, +id) : null;

    const time =
        searchParams.which === 'time' ? await getWorkerPlan(+orgId, +id) : null;

    const workerInventory =
        searchParams.which === 'inventory'
            ? worker.inventories.map((i) => {
                  return { ...i, type: i.type.name, location: i.location.name };
              })
            : null;

    return (
        <div className={scss.info_wrapper}>
            <WorkerTables
                cards={cards?.results ?? null}
                docs={docs}
                workerInventory={workerInventory}
                time={time}
            />
        </div>
    );
};
