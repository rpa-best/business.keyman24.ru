'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import { IAdminPermission, IPermission } from 'http/types';
import { getModeName } from 'helpers/permTypeHelper';
import { getListValues } from 'components/PickList/helpers/getListValues';

import {} from 'http/organizationApi';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';
import {
    createAdminPermission,
    deleteAdminPermission,
} from 'http/permissionsApi';
import { DefaultElem } from 'components/PickList/PickList';

interface PickListPermissionProps {
    permissions: IPermission[];
    adminPermissions: IAdminPermission[];
    orgId: number;
}

export const PickListPermission: React.FC<PickListPermissionProps> = ({
    adminPermissions,
    permissions,
    orgId,
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    //Левая колонка
    const [allPermissions, setAllPermissions] = useState<CustomPermission[]>();
    //Правая колонка
    const [allAdminPermissions, setAllAdminPermissions] =
        useState<CustomAdminPermission[]>();
    const [selectedClicked, setSelectedClicked] = useState<
        CustomAdminPermission[]
    >([]);
    const [availableClicked, setAvailableClicked] = useState<
        CustomPermission[]
    >([]);

    //Конвертация для лучшего UI
    useEffect(() => {
        const available = getListValues(permissions, adminPermissions);
        const selected = adminPermissions.map((perm) => {
            return {
                ...perm,
                name: `${perm?.permission?.name}`,
                customDesc: getModeName(perm?.type),
            };
        });
        setAllPermissions(available);
        setAllAdminPermissions(selected);
        setLoading(false);
    }, [adminPermissions, permissions]);

    //Очистка выбранного при кликах на стрелки
    useEffect(() => {
        setAvailableClicked((prev) =>
            prev.filter((item) => allPermissions?.includes(item))
        );

        setSelectedClicked((prev) =>
            prev.filter((item) => allAdminPermissions?.includes(item))
        );
    }, [allAdminPermissions, allPermissions]);

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
        ).then(() => router.refresh());
        router.refresh();
    };
    const handleArrowLeft = async (elems: CustomAdminPermission[]) => {
        setLoading(true);
        await Promise.all(
            elems.map((el) => {
                deleteAdminPermission({
                    id: el.id,
                    orgId: orgId,
                });
            })
        ).then(() => router.refresh());
        router.refresh();
    };

    return (
        <>
            <PickList
                loading={loading}
                selectedClicked={selectedClicked as any}
                availableClicked={availableClicked as any}
                title="Настройка доступа"
                available={allPermissions as any}
                selected={allAdminPermissions as any}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
            {loading && <Spinner />}
        </>
    );
};
