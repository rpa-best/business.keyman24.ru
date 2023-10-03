'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import {
    createAdminPermission,
    deleteAdminPermission,
    getAdminPermissions,
    getAdminPermissionsOnClient,
    getClientAllPermissions,
} from 'http/permissionsApi';
import { PickListPermissionProps } from 'app/(Main)/org-settings/types';
import { getListValues } from 'components/PickList/helpers/getListValues';

import { IAdminPermission, IPermission } from 'http/types';
import { getModeName } from 'helpers/permTypeHelper';
import { Spinner } from 'components/Spinner';

export const PickListPermission: React.FC<PickListPermissionProps> = () => {
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState<IPermission[]>();
    const [target, setTarget] = useState<IAdminPermission[]>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const allAdminPermissions = await getAdminPermissionsOnClient();
            const target = allAdminPermissions.results.map((perm) => {
                return {
                    ...perm,
                    name: `${perm?.permission?.name}`,
                    customDesc: getModeName(perm?.type),
                };
            });
            const allPermissions = await getClientAllPermissions();
            const source = getListValues(allPermissions, target);

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
                return await createAdminPermission({
                    permission: +el.id,
                    type: el.type,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: CustomAdminPermission[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return deleteAdminPermission({
                    id: +el.id,
                });
            })
        );
    };
    return (
        <>
            <PickList
                title="Настройка доступа"
                available={source as any}
                setLoading={setLoading}
                loading={loading}
                selected={target as any}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                setRefresh={setRefresh}
            />
            {loading && <Spinner />}
        </>
    );
};
