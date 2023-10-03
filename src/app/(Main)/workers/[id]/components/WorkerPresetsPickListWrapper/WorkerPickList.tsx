'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';

import { useRouter } from 'next/navigation';

import {
    createWorkerGroupUser,
    deleteWorkerGroupUser,
    getClientAllPermissions,
    getGroupPermissionsOnClient,
    getWorkerGroupPermissions,
    getWorkerGroupPermissionsOnClient,
    getWorkerPermissionsOnClient,
} from 'http/permissionsApi';
import {
    CustomDefaultElem,
    WorkerPresetPermValues,
} from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper/types';
import { DefaultElem } from 'components/PickList/types';
import {
    getGroupListValues,
    getListValues,
} from 'components/PickList/helpers/getListValues';
import {
    IAdminGroupPermission,
    IAdminPermission,
    IGroupPermission,
} from 'http/types';
import { v4 } from 'uuid';
import { getModeName } from 'helpers/permTypeHelper';

export const WorkerGroupPickList: React.FC<WorkerPresetPermValues> = ({
    workerUsername,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState<IGroupPermission[]>();
    const [target, setTarget] = useState<IAdminGroupPermission[]>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const allGroupPerm = await getGroupPermissionsOnClient();

            const workerGroupPerm = await getWorkerGroupPermissionsOnClient(
                workerUsername
            );

            const groupPermsWithId = allGroupPerm.results.map((el) => {
                return { ...el, uuid: v4() };
            });

            const source = getGroupListValues(
                groupPermsWithId,
                workerGroupPerm as any
            );

            const target = workerGroupPerm?.map((perm) => {
                return {
                    ...perm,
                    content: `${perm?.group?.name}`,
                };
            });

            return { source, target };
        };
        fetchData()
            .then(({ source, target }) => {
                setSource(source);
                setTarget(target);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refresh, workerUsername]);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createWorkerGroupUser(workerUsername, {
                    group: +el.id,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map((el) => {
                return deleteWorkerGroupUser(workerUsername, +el.id);
            })
        );
    };

    return (
        <>
            <PickList
                visible={false}
                hidden
                title="Настройка группы прав"
                loading={loading}
                setLoading={setLoading}
                setRefresh={setRefresh}
                available={source as any}
                selected={target as any}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
        </>
    );
};
