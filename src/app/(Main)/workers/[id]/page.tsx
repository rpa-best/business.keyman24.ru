import React, { Suspense } from 'react';
import { cookies } from 'next/headers';

import { WorkerEditForm } from 'app/(Main)/workers/[id]/components/WorkerEditForm';
import { getWorker, getWorkerUser } from 'http/workerApi';
import { WorkerDocsTable } from 'app/(Main)/workers/[id]/components/WorkerDocsTable';
import { IWorkerUser } from 'http/types';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { WorkersPermissionsPickList } from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper';

import { WorkerGroupPickList } from 'app/(Main)/workers/[id]/components/WorkerPresetsPickListWrapper';

import scss from 'app/(Main)/workers/Worker.module.scss';
import { Spinner } from 'components/Spinner';

interface WorkerPage {
    params: { id: string };
}

const WorkerPage: React.FC<WorkerPage> = async ({ params: { id } }) => {
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
            {!workerUser && (
                <h2 className={scss.tooltip}>
                    Чтобы выбрать права для сотрудника, нужно заполнить карточку
                    c данными!
                </h2>
            )}
            <WorkerEditForm
                workerUser={workerUser as IWorkerUser}
                worker={worker}
            />
            <Suspense fallback={<Spinner />}>
                <WorkerDocsTable id={id} />
            </Suspense>
            {workerUser && (
                <>
                    <WorkersPermissionsPickList
                        workerUsername={workerUser.username}
                    />
                    <WorkerGroupPickList workerUsername={workerUser.username} />
                </>
            )}
        </div>
    );
};

export default WorkerPage;
