'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import { IAdminGroupPermission, IGroupPermission } from 'http/types';
import { getModeName } from 'helpers/permTypeHelper';
import {
    getGroupListValues,
    getListValues,
} from 'components/PickList/helpers/getListValues';

import {} from 'http/organizationApi';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { CustomGroupAdminPermission } from 'app/(Main)/org-settings/components/PickListPermissionGroup/types';
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

    const [loading, setLoading] = useState(false);

    const handleArrowRight = async (elems: CustomPermission[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createAdminGroupPermission({
                    group: el.id,
                    org: orgId,
                });
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    const handleArrowLeft = async (elems: CustomAdminPermission[]) => {
        setLoading(true);
        await Promise.all(
            elems.map((el) => {
                deleteAdminGroupPermission({
                    id: el.id,
                    orgId: orgId,
                });
            })
        ).finally(() => {
            router.refresh();
            setLoading(false);
        });
    };

    return (
        <>
            <PickList
                loading={loading}
                title="Настройка доступа"
                available={permissions as []}
                selected={adminPermissions as []}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
            {loading && <Spinner />}
        </>
    );
};
