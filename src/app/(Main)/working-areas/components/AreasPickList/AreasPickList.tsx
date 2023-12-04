'use client';

import React, { useEffect, useState } from 'react';

import { PickList } from 'components/PickList';
import { DefaultElem } from 'components/PickList/types';
import { Spinner } from 'components/Spinner';
import { WorkingAreaDevicePickList } from 'app/(Main)/working-areas/components/AreasPickList/types';
import { fetchAreasData } from 'app/(Main)/working-areas/components/EditWorkingArea/EditWorkingArea.utils';
import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';
import {
    createWorkingAreaDevice,
    deleteWorkingAreaDevice,
} from 'http/deviceApi';

import scss from 'app/(Main)/permission-group/components/PermissionPickList/PermissionPickList.module.scss';
import { useErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';

export const AreaPickList: React.FC<WorkingAreaDevicePickList> = ({
    areaId,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [source, setSource] = useState<CustomGroupDefaultElem[]>([]);
    const [target, setTarget] = useState<CustomGroupDefaultElem[]>([]);

    const [loading, setLoading] = useState(false);

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        setLoading(true);
        fetchAreasData(areaId as number)
            .catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        showBoundary('Недостаточно прав');
                    }
                }
            })
            .then((d) => {
                if (!d) {
                    return;
                }
                setSource(d.trg as []);
                setTarget(d.src as []);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [areaId, refresh]);

    const handleArrowRight = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createWorkingAreaDevice(+areaId, {
                    areaId: areaId,
                    device: +el.id,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deleteWorkingAreaDevice(areaId, +el.id);
            })
        );
    };

    return (
        <div className={scss.pick_list_wrapper}>
            <PickList
                setRefresh={setRefresh}
                setLoading={setLoading}
                loading={loading}
                hidden
                title="Настройка устройств"
                available={target as []}
                selected={source as []}
                leftTitle="Доступные устройства"
                rightTitle="Назначенные устройства"
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
            />
            {loading && <Spinner />}
        </div>
    );
};
