import * as T from './types';
import { AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';

export const getWorkingAreas: T.GetWorkingAreas = async (orgId) => {
    const res: AxiosResponse<T.IResponse<T.IWorkingArea>> =
        await $serverAuth.get(
            `business/${orgId}/working_area/?offset=0&ordering=id&deleted=false&limit=10`
        );

    return res.data;
};

export const getWorkingAreaTypes: T.GetWorkingAreaTypes = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkingAreaTypes>> =
        await $serverAuth.get(`business/${orgId}/working_area/type/`);

    return res.data;
};

export const getLocations: T.GetLocations = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetLocations>> =
        await $serverAuth.get(`business/${orgId}/location/?deleted=false`);

    return res.data;
};
