import * as T from 'http/types';
import { AxiosResponse } from 'axios';
import { $clientAuth } from 'http/clientIndex';
import { $serverAuth } from 'http/serverIndex';
import UniversalCookies from 'universal-cookie';

const cookie = new UniversalCookies();

export const getLocations: T.GetLocations = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetLocations>> =
        await $serverAuth.get(`business/${orgId}/location/?deleted=false`);

    return res.data;
};

export const getLocationObjects: T.GetLocationObjects = async (
    orgId,
    locationId
) => {
    const res: AxiosResponse<ReturnType<T.GetLocationObjects>> =
        await $serverAuth.get(
            `business/${orgId}/location/${locationId}/object`
        );

    return res.data;
};

export const generateKeys: T.GenerateKeys = async (locId, objId, body) => {
    const orgId = cookie.get('orgId') ?? 1;

    const res: AxiosResponse<ReturnType<T.GenerateKeys>> =
        await $clientAuth.post(
            `business/${orgId}/location/${locId}/object/${objId}/key-generate/`,
            body
        );

    return res.data;
};
