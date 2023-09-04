'use client';

import React from 'react';

import { PickList } from 'components/PickList';
import { IAdminGroupPermission, IGroupPermission } from 'http/types';

import { useRouter } from 'next/navigation';

import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import {
    createAdminGroupPermission,
    deleteAdminGroupPermission,
} from 'http/permissionsApi';

interface PickListPermissionGroupProps {
    permissions: IGroupPermission[];
    adminPermissions: IAdminGroupPermission[];
    orgId: number;
}

export const PickListPermissionGroup: React.FC<
    PickListPermissionGroupProps
> = ({ adminPermissions, permissions, orgId }) => {
    const router = useRouter();

    const handleArrowRight = async (elems: CustomPermission[]) => {
        await Promise.all(
            elems.map(async (el) => {
                await createAdminGroupPermission({
                    group: el.id,
                    org: orgId,
                });
            })
        ).finally(() => {
            router.refresh();
        });
    };

    const handleArrowLeft = async (elems: CustomAdminPermission[]) => {
        await Promise.all(
            elems.map((el) => {
                deleteAdminGroupPermission({
                    id: el.id,
                    orgId: orgId,
                });
            })
        ).finally(() => {
            router.refresh();
        });
    };

    return (
        <>
            <PickList
                title="Настройка группы прав доступа"
                available={permissions as []}
                selected={adminPermissions as []}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
        </>
    );
};
