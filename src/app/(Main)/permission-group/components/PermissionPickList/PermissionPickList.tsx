'use client';

import React, { useEffect, useState } from 'react';

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
import { fetchData } from 'app/(Main)/permission-group/components/PermModalForm/fetchData';

import scss from './PermissionPickList.module.scss';

export const PermissionPickList: React.FC<WorkingAreaPickList> = ({
    groupId,
    id,
    levelId,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<CustomGroupDefaultElem[]>([]);
    const [target, setTarget] = useState<CustomGroupDefaultElem[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchData(id as number, levelId as number)
            .then((d) => {
                setSource(d.src as []);
                setTarget(d.trg as []);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, levelId, refresh]);

    const handleArrowRight = async (elems: CustomGroupDefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createPermissionGroupPermission(
                    groupId,
                    +el.id,
                    el.type
                );
            })
        );
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deletePermissionGroupPermission(groupId, +el.id);
            })
        );
    };

    return (
        <div className={scss.pick_list_wrapper}>
            <PickList
                hidden
                loading={loading}
                setLoading={setLoading}
                setRefresh={setRefresh}
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
