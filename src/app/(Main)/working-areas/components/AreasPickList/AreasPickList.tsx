'use client';

import React, { useState } from 'react';

import { PickList } from 'components/PickList';
import { DefaultElem } from 'components/PickList/types';
import { Spinner } from 'components/Spinner';
import { WorkingAreaDevicePickList } from 'app/(Main)/working-areas/components/AreasPickList/types';

import {
    createWorkingAreaDevice,
    deleteWorkingAreaDevice,
} from 'http/deviceApi';

import scss from 'app/(Main)/permission-group/components/PermissionPickList/PermissionPickList.module.scss';

export const AreaPickList: React.FC<WorkingAreaDevicePickList> = ({
    target,
    source,
    areaId,
    setRefresh,
}) => {
    const [loading, setLoading] = useState(false);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        setLoading(true);
        await Promise.all(
            elems.map(async (el) => {
                await createWorkingAreaDevice(+areaId, {
                    areaId: areaId,
                    device: +el.id,
                });
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
                await deleteWorkingAreaDevice(areaId, +el.id);
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
                title="Настройка устройств"
                available={target as []}
                selected={source as []}
                leftTitle="Доступные устройства"
                rightTitle="Назначенные устройства"
                handleArrowLeft={handleArrowLeft}
                handleArrowRight={handleArrowRight}
            />
            {loading && <Spinner />}
        </div>
    );
};
