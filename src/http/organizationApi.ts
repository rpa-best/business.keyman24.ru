import { AxiosResponse } from 'axios';
import * as T from 'http/types';
import { IOrganization } from 'store/types';
import { $serverAuth } from 'http/indexes/serverIndex';
import { $clientAuth } from 'http/indexes/clientIndex';
import UniversalCookies from 'universal-cookie';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getOrganizations: T.GetOrganizations = async () => {
    const response: AxiosResponse<IOrganization[]> = await $serverAuth.get(
        'business/orgs/'
    );
    if (response.status !== 200) {
        throw new Error('Failed to org/fetchByIdOrg.');
    }

    return response.data;
};

export const getClientOrganizations: T.GetOrganizations = async () => {
    const response: AxiosResponse<IOrganization[]> = await $clientAuth.get(
        'business/orgs/?limit=1&offset=0'
    );
    if (response.status !== 200) {
        throw new Error('Failed to org/fetchByIdOrg.');
    }

    return response.data;
};

export const getOrganizationContractors: T.GetOrganizationContractors = async (
    orgId
) => {
    const response: AxiosResponse<IOrganization[]> = await $serverAuth.get(
        `business/${orgId}/org`
    );

    if (response.status !== 200) {
        throw new Error('Failed to org/fetchByIdOrg.');
    }

    return response.data;
};

export const getOrganizationContractorsOnClient: T.GetOrganizationContractorsOnClient =
    async () => {
        const response: AxiosResponse<IOrganization[]> = await $clientAuth.get(
            `business/${orgId}/org`
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

export const getServices: T.GetServices = async (org) => {
    const res: AxiosResponse<ReturnType<typeof getServices>> =
        await $serverAuth.get(`business/${org}/service/subscription/`);

    return res.data;
};

export const getPrice: T.GetPrice = async (body) => {
    const res: AxiosResponse<ReturnType<typeof getPrice>> =
        await $clientAuth.post('account/service-rate-calc/', body);

    return res.data;
};

export const getPriceBySlug: T.GetPriceBySlug = async (slug) => {
    const res: AxiosResponse<ReturnType<typeof getPriceBySlug>> =
        await $clientAuth.get(`business/${orgId}/service/service-rate/${slug}`);

    return res.data;
};

export const getServerPriceBySlug: T.GetServerPriceBySlug = async (
    orgId,
    slug
) => {
    const res: AxiosResponse<ReturnType<typeof getServerPriceBySlug>> =
        await $serverAuth.get(`business/${orgId}/service/service-rate/${slug}`);

    return res.data;
};

export const getServerPrice: T.GetPrice = async (body, query) => {
    const searchParams = new URLSearchParams();

    if (query.prime) {
        searchParams.set('prime', 'true');
    }

    const res: AxiosResponse<ReturnType<typeof getPrice>> =
        await $serverAuth.post(`account/service-rate-calc/`, body, {
            params: searchParams,
        });

    return res.data;
};

export const updateSub: T.UpdatePrice = async (body) => {
    await $clientAuth.patch(`business/${orgId}/service/subscription/`, body);
};

export const getServerHistory: T.GetHistory = async (orgId, type) => {
    const searchParams = new URLSearchParams();

    if (type) {
        searchParams.set('type', 'month');
    }

    const res: AxiosResponse<ReturnType<typeof getServerHistory>> =
        await $serverAuth.get(
            `business/${orgId}/balance-history/?ordering=_date`,
            { params: searchParams }
        );

    return res.data;
};

export const topUpBalance: T.TopUpBalance = async (summa) => {
    const body = {
        summa,
        org: orgId,
    };
    const res = await $clientAuth.post(
        `business/${orgId}/service/payment-doc/`,
        body
    );
    return res.data;
};

export const updateOrg = async () => {
    const res = await $clientAuth.post(
        `business/orgs/${orgId}/org_update/`,
        {}
    );

    return res.data;
};
