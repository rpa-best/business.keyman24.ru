import * as T from 'http/types';
import UniversalCookies from 'universal-cookie';
import { $clientAuth } from 'http/indexes/clientIndex';
import { AxiosResponse } from 'axios';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getDevices: T.GetDevices = async () => {
    const res: AxiosResponse<ReturnType<T.GetDevices>> = await $clientAuth.get(
        `business/${orgId}/device/?place=working_area`
    );

    return res.data;
};

export const getWorkingAreaDevices: T.GetWorkingAreaDevices = async (
    areaId
) => {
    const res: AxiosResponse<ReturnType<T.GetWorkingAreaDevices>> =
        await $clientAuth.get(
            `business/${orgId}/working_area/${areaId}/device/`
        );

    return res.data;
};

export const createWorkingAreaDevice: T.CreateWorkingAreaDevice = async (
    areaId,
    body
) => {
    const res = await $clientAuth.post(
        `business/${orgId}/working_area/${areaId}/device/`,
        body
    );
    return res.data;
};

export const deleteWorkingAreaDevice: T.DeleteWorkingAreaDevice = async (
    areaId,
    deviceId
) => {
    return await $clientAuth.delete(
        `business/${orgId}/working_area/${areaId}/device/${deviceId}`
    );
};
