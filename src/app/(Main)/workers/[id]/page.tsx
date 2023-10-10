import React, { Suspense } from 'react';
import { cookies } from 'next/headers';

import { getWorker, getWorkerUser } from 'http/workerApi';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { WorkerActionsWrapper } from 'app/(Main)/workers/[id]/components/WorkersActionsWrapper';
import { Spinner } from 'components/Spinner';
import { WorkerDocsTable } from 'app/(Main)/workers/[id]/components/WorkerDocsTable';

import scss from 'app/(Main)/workers/Worker.module.scss';

interface WorkerPage {
    params: { id: string };
    searchParams: { which: 'docs' | 'inventory' | 'card' | 'time' };
}

const WorkerPage: React.FC<WorkerPage> = async ({
    params: { id },
    searchParams,
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const worker = await getWorker(+orgId, +id);

    let workerUser = null;

    if (worker.user) {
        workerUser = await getWorkerUser(+orgId, +id);
    }

    return (
        <div className={scss.children_with_table}>
            <div className={scss.page_title_with_table_back_button}>
                <h1>Работник / редактирование</h1>
                <BackButton>Назад</BackButton>
            </div>
            <WorkerActionsWrapper workerUser={workerUser} worker={worker}>
                <Suspense fallback={<Spinner />}>
                    <WorkerDocsTable searchParams={searchParams} id={id} />
                </Suspense>
            </WorkerActionsWrapper>
        </div>
    );
};

export default WorkerPage;
