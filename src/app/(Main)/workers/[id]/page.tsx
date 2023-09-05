import React from 'react';

import { WorkerEditForm } from 'app/(Main)/workers/[id]/components/WorkerEditForm';
import {
    getServerWorkerDocs,
    getWorker,
    getWorkerCard,
    getWorkerUser,
} from 'http/workerApi';
import { cookies } from 'next/headers';

import { WorkerDocsTable } from 'app/(Main)/workers/[id]/components/WorkerDocsTable';
import { IAdminPermission, IWorkerDocs, IWorkerUser } from 'http/types';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { WorkersPermissionsPickList } from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper';
import {
    getGroupPermissions,
    getPermissions,
    getWorkerGroupPermissions,
    getWorkerPermissions,
} from 'http/permissionsApi';
import {
    getGroupListValues,
    getListValues,
} from 'components/PickList/helpers/getListValues';
import { getModeName } from 'helpers/permTypeHelper';
import { WorkerGroupPickList } from 'app/(Main)/workers/[id]/components/WorkerPresetsPickListWrapper';

import scss from 'app/(Main)/workers/Worker.module.scss';

interface WorkerPage {
    params: { id: string };
}

const WorkerPage: React.FC<WorkerPage> = async ({ params: { id } }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const worker = await getWorker(+orgId, +id);

    let workerUser = null;

    if (worker.user) {
        workerUser = await getWorkerUser(+orgId, +id);
    }

    const workerCards = await getWorkerCard(+orgId, +id);

    const workerDocs = await getServerWorkerDocs(+id, +orgId);

    const modifiedWorkerDocs = workerDocs.results.map((w) => {
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

    const allPermissions = await getPermissions(+orgId as number);

    const allGroupPerm = await getGroupPermissions(+orgId);

    const workerPermission = workerUser?.username
        ? await getWorkerPermissions(+orgId, workerUser.username)
        : null;

    const workerGroupPerm = workerUser?.username
        ? await getWorkerGroupPermissions(+orgId, workerUser.username)
        : undefined;

    const permissionTarget = getListValues(
        allPermissions,
        workerPermission as IAdminPermission[]
    );

    const permissionSource = workerPermission?.map((perm) => {
        return {
            ...perm,
            name: `${perm?.permission?.name}`,
            customDesc: getModeName(perm?.type),
        };
    });

    const groupPermissionSource = getGroupListValues(
        allGroupPerm.results,
        workerGroupPerm as any
    );

    const groupPermissionTarget = workerGroupPerm?.map((perm) => {
        return {
            ...perm,
            content: `${perm?.group?.name}`,
        };
    });

    const workerInventory = worker.inventories.map((i) => {
        return { ...i, type: i.type.name };
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.page_title_with_table_back_button}>
                <h1>Работник / редактирование</h1>
                <BackButton>Назад</BackButton>
            </div>
            <WorkerEditForm
                workerUser={workerUser as IWorkerUser}
                worker={worker}
            />
            <WorkerDocsTable
                workerInventory={workerInventory}
                docs={modifiedWorkerDocs}
                cards={workerCards.results}
            />
            {workerUser ? (
                <>
                    <WorkersPermissionsPickList
                        workerUsername={workerUser.username}
                        target={permissionSource as any}
                        source={permissionTarget as any}
                    />
                    <WorkerGroupPickList
                        workerUsername={workerUser.username}
                        target={groupPermissionTarget as any}
                        source={groupPermissionSource as any}
                    />
                </>
            ) : (
                <h2 className={scss.tooltip}>
                    Чтобы выбрать права для сотрудника, нужно заполнить карточку
                    c данными!
                </h2>
            )}
        </div>
    );
};

export default WorkerPage;
