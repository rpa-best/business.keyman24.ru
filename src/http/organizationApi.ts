import { AxiosResponse } from 'axios';
import * as T from 'http/types';
import { IOrganization } from 'store/types';
import { $serverAuth } from 'http/serverIndex';

export const getOrganizations: T.GetOrganizations = async () => {
    const response: AxiosResponse<IOrganization[]> = await $serverAuth.get(
        'business/orgs/'
    );

    if (response.status !== 200) {
        throw new Error('Failed to org/fetchByIdOrg.');
    }

    return response.data;
};

export const getOrgById: T.GetOrgById = async (id: number = 1) => {
    const response: AxiosResponse<IOrganization> = await $serverAuth.get(
        `business/orgs/${id}/`
    );

    if (response.status !== 200) {
        throw new Error('Failed to org/fetchByIdOrg.');
    }

    return response.data;
};
