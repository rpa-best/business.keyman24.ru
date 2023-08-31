'use client';

import React, { useState } from 'react';

import { PickList } from 'components/PickList';
import {
    createPermissionGroupPermission,
    deletePermissionGroupPermission,
} from 'http/permissionsApi';
import { DefaultElem } from 'components/PickList/types';
import {
    CustomGroupDefaultElem,
    WorkingAreaPickList,
} from 'app/(Main)/permission-group/components/PermissionPickList/types';
import { Spinner } from 'components/Spinner';

import scss from './PermissionPickList.module.scss';

export const PermissionPickList: React.FC<WorkingAreaPickList> = ({
    target,
    source,
    groupId,
    setRefresh,
}) => {
    const [loading, setLoading] = useState(false);

    const handleArrowRight = async (elems: CustomGroupDefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createPermissionGroupPermission(groupId, +el.id, el.type);
            })
        ).finally(() => {
            setRefresh((r) => !r);
            setLoading(false);
        });
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await deletePermissionGroupPermission(groupId, +el.id);
            })
        ).finally(() => {
            setRefresh((r) => !r);
            setLoading(false);
        });
    };

    return (
        <div className={scss.pick_list_wrapper}>
            <PickList
                hidden
                title="Настройка группы прав доступа"
                available={target as []}
                selected={source as []}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
            {loading && <Spinner />}
        </div>
    );
};
