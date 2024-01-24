import { sendSessionAction } from 'http/workingAreaApi';
import { getInventoryImage } from 'http/inventoryApi';
import revalidate from 'utils/revalidate';
import { toast } from 'react-toastify';
import { errorToastOptions, successToastConfig } from 'config/toastConfig';
import { AxiosError } from 'axios';
import { IInventoryImage, SessionActionBody } from 'http/types';
import React from 'react';
import { CurrentSessionLogType } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';

interface SendActionProps {
    areaId: number;
    sessionId: number;
    validate: boolean;
    body: SessionActionBody;
    type: 'inventory' | 'keys' | 'registerInventory';
    setImages: React.Dispatch<React.SetStateAction<IInventoryImage[] | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    path: string;
    setSessionLog: React.Dispatch<
        React.SetStateAction<CurrentSessionLogType[]>
    >;
    setTemporaryLog?: React.Dispatch<
        React.SetStateAction<CurrentSessionLogType[]>
    >;
}

export const sendAction = async ({
    areaId,
    sessionId,
    validate,
    body,
    type,
    setImages,
    setLoading,
    path,
    setSessionLog,
    setTemporaryLog,
}: SendActionProps) => {
    if (validate) {
        try {
            const d = await sendSessionAction(areaId, sessionId, body, true);

            const mode = d.mode ? 'Выдан' : 'Сдан';
            const inventoryName =
                type === 'keys'
                    ? ` ${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.objectArea.name}`
                    : `${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.location.name}`;

            const newLog: CurrentSessionLogType = {
                ...d,
                workerName: d.worker.name,
                modeName: mode,
                inventoryName,
            };
            if (type !== 'keys') {
                getInventoryImage(d.inventory.id)
                    .then((d) => {
                        setImages(d.results);
                    })
                    .finally(() => setLoading(false));
            }

            if (setTemporaryLog) {
                setTemporaryLog((log) => [newLog, ...log]);
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                toast(e.response?.data.error[0].name, errorToastOptions);
            }
        } finally {
            setLoading(false);
        }
    } else {
        await sendSessionAction(areaId, sessionId, body)
            .then((d) => {
                let newLog: CurrentSessionLogType;
                let mode: string;
                if (type !== 'keys') {
                    getInventoryImage(d.inventory.id)
                        .then((d) => {
                            setImages(d.results);
                        })
                        .finally(() => setLoading(false));
                }
                if (type === 'registerInventory') {
                    mode = d.mode ? 'Зарегестрировано' : 'Сдано';
                    newLog = {
                        ...d,
                        modeName: mode,
                        inventoryName: `${d?.inventory?.id} ${d?.inventory?.name}`,
                    };
                } else {
                    const inventoryName =
                        type === 'keys'
                            ? ` ${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.objectArea.name}`
                            : `${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.location.name}`;
                    mode = d.mode ? 'Выдан' : 'Сдан';
                    newLog = {
                        ...d,
                        workerName: d.worker.name,
                        modeName: mode,
                        inventoryName,
                    };
                }
                if (type === 'registerInventory') {
                    revalidate('/inventory');
                }
                revalidate(path);
                setSessionLog((log) => [newLog, ...log]);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((e: AxiosError) => {
                // @ts-ignore
                errors.code = e.response.data.error[0].name;
            });
    }
};
