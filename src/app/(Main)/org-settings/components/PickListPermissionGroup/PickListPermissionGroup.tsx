'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import { IAdminGroupPermission, IGroupPermission } from 'http/types';

import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import {
    createAdminGroupPermission,
    deleteAdminGroupPermission,
    getGroupAdminPermissionsOnClient,
    getGroupPermissionsOnClient,
} from 'http/permissionsApi';
import { getGroupListValues } from 'components/PickList/helpers/getListValues';

interface PickListPermissionGroupProps {}

export const PickListPermissionGroup: React.FC<
    PickListPermissionGroupProps
> = () => {
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<IGroupPermission[]>();
    const [target, setTarget] = useState<IAdminGroupPermission[]>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const allGroupAdminPermissions =
                await getGroupAdminPermissionsOnClient();

            const target = allGroupAdminPermissions.results.map((perm) => {
                return {
                    ...perm,
                    content: `${perm?.group?.name}`,
                };
            });
            const allGroupPermissions = await getGroupPermissionsOnClient();

            const source = getGroupListValues(
                allGroupPermissions.results,
                target
            );

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
    }, [refresh]);

    const handleArrowRight = async (elems: CustomPermission[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createAdminGroupPermission({
                    group: +el.id,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: CustomAdminPermission[]) => {
        return await Promise.all(
            elems.map((el) => {
                return deleteAdminGroupPermission({
                    id: +el.id,
                });
            })
        );
    };

    return (
        <>
            <PickList
                loading={loading}
                setLoading={setLoading}
                title="Настройка группы прав доступа"
                available={source as []}
                selected={target as []}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                setRefresh={setRefresh}
            />
        </>
    );
};
