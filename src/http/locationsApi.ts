import * as T from 'http/types';
import { AxiosResponse } from 'axios';
import { $clientAuth } from 'http/clientIndex';
import { $serverAuth } from 'http/serverIndex';
import UniversalCookies from 'universal-cookie';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId') ?? 1;

export const getLocations: T.GetLocations = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetLocations>> =
        await $serverAuth.get(`business/${orgId}/location/?deleted=false`);

    return res.data;
};

export const getLocation: T.GetLocation = async (orgId, locId) => {
    const res: AxiosResponse<ReturnType<T.GetLocation>> = await $serverAuth.get(
        `business/${orgId}/location/${locId}`
    );

    return res.data;
};

export const createLocation: T.CreateLocation = async (body) => {
    await $clientAuth.post(`business/${orgId}/location/`, body);
};

export const editLocation: T.EditLocation = async (locId, body) => {
    await $clientAuth.patch(`business/${orgId}/location/${locId}/`, body);
};

export const deleteLocation: T.DeleteLocation = async (locId) => {
    await $clientAuth.delete(`business/${orgId}/location/${locId}/`);
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
    const res: AxiosResponse<ReturnType<T.GenerateKeys>> =
        await $clientAuth.post(
            `business/${orgId}/location/${locId}/object/${objId}/key-generate/`,
            body
        );

    return res.data;
};
