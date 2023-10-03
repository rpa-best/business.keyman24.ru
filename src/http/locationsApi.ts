import * as T from 'http/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
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

export const getLocationsOnClient: T.GetLocationsOnClient = async () => {
    const res: AxiosResponse<ReturnType<T.GetLocations>> =
        await $clientAuth.get(`business/${orgId}/location/?deleted=false`);

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
            `business/${orgId}/location/${locationId}/object?deleted=false`
        );

    return res.data;
};

export const createLocationObject: T.CreateLocationObject = async (
    locId,
    body
) => {
    await $clientAuth.post(`business/${orgId}/location/${locId}/object/`, body);
};

export const editLocationObject: T.EditLocationObject = async (
    locId,
    objId,
    body
) => {
    await $clientAuth.patch(
        `business/${orgId}/location/${locId}/object/${objId}/`,
        body
    );
};

export const deleteLocationObject: T.DeleteLocationObject = async (
    locId,
    objId
) => {
    await $clientAuth.delete(
        `business/${orgId}/location/${locId}/object/${objId}/`
    );
};

export const getLocationKeys: T.GetLocationKeys = async (
    orgId,
    locId,
    objId,
    { full, offset }
) => {
    const query = new URLSearchParams();
    query.set('limit', '25');
    offset && query.set('offset', offset);

    const config: AxiosRequestConfig = {
        params: !full ? query : undefined,
    };

    const res: AxiosResponse<ReturnType<T.GetLocationKeys>> =
        await $serverAuth.get(
            `business/${orgId}/location/${locId}/object/${objId}/inventory/?ordering=name&type=keys`,
            config
        );

    return res.data;
};

export const getLocationClientKeys: T.GetLocationClientKeys = async (
    locId,
    objId
) => {
    const res: AxiosResponse<ReturnType<T.GetLocationKeys>> =
        await $clientAuth.get(
            `business/${orgId}/location/${locId}/object/${objId}/inventory/?ordering=name&type=keys`
        );

    return res.data;
};

export const createLocationKeys: T.CreateLocationKeys = async (
    locId,
    objId,
    body
) => {
    await $clientAuth.post(
        `business/${orgId}/location/${locId}/object/${objId}/key-generate/`,
        body
    );
};

export const deleteLocationKey: T.DeleteLocationKey = async (
    locId,
    objId,
    invId
) => {
    await $clientAuth.delete(
        `business/${orgId}/location/${locId}/object/${objId}/inventory/${invId}`
    );
};

export const getLocationWorkers: T.GetLocationWorkers = async (
    orgId,
    locationId
) => {
    const res: AxiosResponse<ReturnType<T.GetLocationWorkers>> =
        await $serverAuth.get(
            `business/${orgId}/location/${locationId}/worker`
        );

    return res.data;
};
export const getLocationWorkersOnClient: T.GetLocationWorkersOnClient = async (
    locationId
) => {
    const res: AxiosResponse<ReturnType<T.GetLocationWorkers>> =
        await $clientAuth.get(
            `business/${orgId}/location/${locationId}/worker`
        );

    return res.data;
};

export const getLocationOrganizations: T.GetLocationOrganizations = async (
    orgId,
    locationId
) => {
    const res: AxiosResponse<ReturnType<T.GetLocationOrganizations>> =
        await $serverAuth.get(`business/${orgId}/location/${locationId}/org`);

    return res.data;
};

export const getLocationOrganizationsOnClient: T.GetLocationOrganizationsOnClient =
    async (locationId) => {
        const res: AxiosResponse<ReturnType<T.GetLocationOrganizations>> =
            await $clientAuth.get(
                `business/${orgId}/location/${locationId}/org`
            );

        return res.data;
    };

export const createLocationOrganization: T.CreateLocationOrg = async (body) => {
    const res = await $clientAuth.post(
        `business/${orgId}/location/${body.location}/org/`,
        body
    );
    return res.data;
};

export const createLocationWorker: T.CreateLocationWorker = async (body) => {
    const res = await $clientAuth.post(
        `business/${orgId}/location/${body.location}/worker/`,
        body
    );
    return res.data;
};

export const deleteLocationOrganization: T.DeleteLocationOrg = async (
    locationId,
    organizationId
) => {
    return await $clientAuth.delete(
        `business/${orgId}/location/${locationId}/org/${organizationId}`
    );
};
export const deleteLocationWorker: T.DeleteLocationWorker = async (
    locationId,
    workerId
) => {
    await $clientAuth.delete(
        `business/${orgId}/location/${locationId}/worker/${workerId}`
    );
};

export const getKeyHistory: T.GetKeyHistory = async (
    orgId,
    locId,
    objId,
    keyId,
    offset
) => {
    const query = new URLSearchParams();
    query.set('limit', '30');
    offset ? query.set('offset', offset.toString()) : '';

    const res: AxiosResponse<ReturnType<typeof getKeyHistory>> =
        await $serverAuth.get(
            `business/${orgId}/location/${locId}/object/${objId}/inventory/${keyId}/history/`,
            { params: query }
        );

    return res.data;
};
