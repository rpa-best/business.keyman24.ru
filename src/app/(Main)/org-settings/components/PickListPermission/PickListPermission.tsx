'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PickList } from 'components/PickList';
import { Spinner } from 'components/Spinner';
import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import {
    createAdminPermission,
    deleteAdminPermission,
} from 'http/permissionsApi';
import { PickListPermissionProps } from 'app/(Main)/org-settings/types';

export const PickListPermission: React.FC<PickListPermissionProps> = ({
    adminPermissions,
    permissions,
    orgId,
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleArrowRight = async (elems: CustomPermission[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createAdminPermission({
                    permission: el.id,
                    org: orgId,
                    type: el.type,
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
            elems.map(async (el) => {
                await deleteAdminPermission({
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
                available={permissions as any}
                selected={adminPermissions as any}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
            {loading && <Spinner />}
        </>
    );
};
