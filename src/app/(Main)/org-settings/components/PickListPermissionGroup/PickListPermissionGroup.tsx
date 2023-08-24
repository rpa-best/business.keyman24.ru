'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import { IAdminGroupPermission, IGroupPermission } from 'http/types';
import { getModeName } from 'helpers/permTypeHelper';
import {
    getGroupListValues,
    getListValues,
} from 'components/PickList/helpers/getListValues';

import {
    createAdminGroupOrganizationPermission,
    deleteAdminGroupOrganizationPermission,
} from 'http/organizationApi';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { CustomGroupAdminPermission } from 'app/(Main)/org-settings/components/PickListPermissionGroup/types';
import {
    CustomAdminPermission,
    CustomPermission,
} from 'app/(Main)/org-settings/components/PickListPermission/types';

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

    //Левая колонка
    const [allPermissions, setAllPermissions] = useState<IGroupPermission[]>();
    //Правая колонка
    const [allAdminPermissions, setAllAdminPermissions] =
        useState<CustomGroupAdminPermission[]>();

    const [selectedClicked, setSelectedClicked] = useState<
        CustomGroupAdminPermission[]
    >([]);
    const [availableClicked, setAvailableClicked] = useState<
        IGroupPermission[]
    >([]);

    //Конвертация для лучшего UI
    useEffect(() => {
        const available = getGroupListValues(permissions, adminPermissions);
        const selected = adminPermissions.map((perm) => {
            return {
                ...perm,
                content: `${perm?.group?.name}`,
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

    const handleArrowRight = (elems: CustomPermission[]) => {
        if (availableClicked.length === 0) {
            return;
        }
        setLoading(true);
        Promise.all(
            elems.map(async (el) => {
                await createAdminGroupOrganizationPermission({
                    group: el.id,
                    org: orgId,
                });
            })
        ).then(() => {
            router.refresh();
        });
    };

    const handleArrowLeft = (elems: CustomAdminPermission[]) => {
        if (selectedClicked.length === 0) {
            return;
        }
        setLoading(true);
        Promise.all(
            elems.map((el) => {
                deleteAdminGroupOrganizationPermission({
                    id: el.id,
                    orgId: orgId,
                });
            })
        ).then(() => router.refresh());
    };

    return (
        <>
            <PickList
                loading={loading}
                selectedClicked={selectedClicked}
                availableClicked={availableClicked}
                setSelectedClicked={setSelectedClicked}
                setAvailableClicked={setAvailableClicked}
                title="Настройка доступа"
                available={allPermissions}
                selected={allAdminPermissions}
                handleArrowLeft={handleArrowLeft}
                handleArrowRight={handleArrowRight}
            />
            {loading && <Spinner />}
        </>
    );
};
