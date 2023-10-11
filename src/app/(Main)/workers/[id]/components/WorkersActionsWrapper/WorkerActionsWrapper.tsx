'use client';

import React, { useState } from 'react';

import { WorkersPermissionsPickList } from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper';
import { WorkerGroupPickList } from 'app/(Main)/workers/[id]/components/WorkerPresetsPickListWrapper';
import { IWorker, IWorkerUser } from 'http/types';
import { WorkerEditForm } from 'app/(Main)/workers/[id]/components/WorkerEditForm';

import scss from 'app/(Main)/workers/Worker.module.scss';

export interface WorkerActionsWrapperProps {
    workerUser: IWorkerUser | null;
    worker: IWorker;
    children: React.ReactNode;
}

export const WorkerActionsWrapper: React.FC<WorkerActionsWrapperProps> = ({
    worker,
    workerUser,
    children,
}) => {
    const [workerUserData, setWorkerUserData] = useState<IWorkerUser | null>(
        workerUser
    );

    const onUserSubmit = (phone: string, username: string) => {
        setWorkerUserData({
            phone,
            username,
            isActive: true,
            lastname: '',
            name: '',
            surname: '',
        });
    };

    return (
        <>
            {!workerUserData && (
                <h2 className={scss.tooltip}>
                    Чтобы выбрать права для сотрудника, нужно заполнить карточку
                    c данными!
                </h2>
            )}
            <WorkerEditForm
                onUserSubmit={onUserSubmit}
                workerUser={workerUserData}
                worker={worker}
            />
            {children}
            {workerUserData && (
                <>
                    <WorkersPermissionsPickList
                        workerUsername={workerUserData.username}
                    />
                    <WorkerGroupPickList
                        workerUsername={workerUserData.username}
                    />
                </>
            )}
        </>
    );
};
