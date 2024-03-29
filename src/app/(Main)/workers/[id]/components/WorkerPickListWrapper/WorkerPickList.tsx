'use client';

import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { PickList } from 'components/PickList';
import { Spinner } from 'components/Spinner';
import { DefaultElem } from 'components/PickList/types';
import {
    CustomDefaultElem,
    WorkerPickListPermissionsWrapper,
} from 'app/(Main)/workers/[id]/components/WorkerPickListWrapper/types';
import {
    createWorkerPermission,
    deleteWorkerPermission,
    getClientAllPermissions,
    getWorkerPermissionsOnClient,
} from 'http/permissionsApi';
import { getModeName } from 'utils/permTypeHelper';
import { getListValues } from 'components/PickList/helpers/getListValues';
import { useErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';

export const WorkersPermissionsPickList: React.FC<
    WorkerPickListPermissionsWrapper
> = ({ workerUsername }) => {
    const [refresh, setRefresh] = useState(false);

    const [source, setSource] = useState<CustomDefaultElem[]>();
    const [target, setTarget] = useState<CustomDefaultElem[]>();

    const [loading, setLoading] = useState(false);

    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const allPermissions = await getClientAllPermissions().catch(
                (e) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.status === 403) {
                            showBoundary('Недостаточно прав');
                        }
                    }
                }
            );

            const workerPermission = await getWorkerPermissionsOnClient(
                workerUsername
            ).catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        showBoundary('Недостаточно прав');
                    }
                }
            });

            if (!allPermissions) {
                return;
            }

            if (!workerPermission) {
                return;
            }

            const source = getListValues(allPermissions, workerPermission);

            const target = workerPermission.map((perm) => {
                return {
                    ...perm,
                    uuid: v4(),
                    name: `${perm?.permission?.name}`,
                    customDesc: getModeName(perm?.type),
                };
            });

            return { source, target };
        };
        fetchData()
            .then((props) => {
                if (!props) {
                    return;
                }
                const { source, target } = props;
                setSource(source);
                setTarget(target);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [workerUsername, refresh]);

    const handleArrowRight = async (elems: CustomDefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await createWorkerPermission({
                    user: workerUsername,
                    permission: +el.id,
                    type: el.type,
                });
            })
        );
    };

    const handleArrowLeft = async (elems: DefaultElem[]) => {
        return await Promise.all(
            elems.map(async (el) => {
                return await deleteWorkerPermission(workerUsername, el.id);
            })
        );
    };

    return (
        <>
            <PickList
                hidden={true}
                visible={false}
                handleArrowLeft={handleArrowLeft as any}
                handleArrowRight={handleArrowRight as any}
                available={source as any}
                setRefresh={setRefresh}
                setLoading={setLoading}
                loading={loading}
                selected={target as any}
                title="Настройки прав пользователя"
            />
            {loading && <Spinner />}
        </>
    );
};
