import React from 'react';

import { WorkerEditForm } from 'app/(Main)/workers/[id]/components/WorkerEditForm';
import { getServerWorkerDocs, getWorker, getWorkerCard } from 'http/workerApi';
import { cookies } from 'next/headers';

import scss from 'app/(Main)/workers/Worker.module.scss';
import { WorkerDocsTable } from 'app/(Main)/workers/[id]/components/WorkerDocsTable';

interface WorkerPage {
    params: { id: string };
    searchParams: { which: 'docs' | 'card' };
}

const WorkerPage: React.FC<WorkerPage> = async ({
    params: { id },
    searchParams: { which = 'card' },
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const worker = await getWorker(+orgId, +id);

    const workerInfo =
        which === 'card'
            ? await getWorkerCard(+orgId, +id)
            : await getServerWorkerDocs(+id, +orgId);

    return (
        <div className={scss.children_with_table}>
            <h1 className={scss.page_title_with_table}>
                Работники / редактирование
            </h1>
            <WorkerEditForm worker={worker} />
            <WorkerDocsTable info={workerInfo.results} searchParams={which} />
        </div>
    );
};

export default WorkerPage;
