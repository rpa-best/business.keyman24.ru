import { AxiosResponse } from 'axios';
import * as T from 'http/types';
import { IOrganization } from 'store/types';
import { $serverAuth } from 'http/serverIndex';
import { $clientAuth } from 'http/clientIndex';
import {
    IAdminGroupPermission,
    IAdminPermission,
    IGroupPermission,
} from 'http/types';

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

export const getOrganizationPermissions: T.GetOrgPermissions = async (
    orgId: number
) => {
    const response: AxiosResponse<T.IPermission[]> = await $serverAuth.get(
        `business/${orgId}/permission?ordering=id`
    );

    if (response.status !== 200) {
        throw new Error('Ошибка в получении данных для настройки прав доступа');
    }

    return response.data;
};

export const getAdminOrganizationPermissions: T.GetAdminOrgPermissions = async (
    orgId
) => {
    const response: AxiosResponse<T.IResponse<IAdminPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/admin?ordering=id`);

    if (response.status !== 200) {
        throw new Error('Ошибка получения разрешений высшего уровня');
    }

    return response.data;
};

export const createAdminOrganizationPermission: T.CreateOrgPermission = async ({
    permission,
    org,
    type,
}) => {
    const response: AxiosResponse<T.IPermissionObject> = await $clientAuth.post(
        `business/${org}/permission/admin/`,
        {
            permission,
            org,
            type,
        }
    );

    if (response.status !== 201) {
        throw new Error('Ошибка в создании настройки прав доступа');
    }

    return response.data;
};

export const deleteAdminOrganizationPermission: T.DeleteOrgPermission = async ({
    id,
    orgId,
}) => {
    await $clientAuth.delete(`business/${orgId}/permission/admin/${id}`);
};

export const getGroupOrgPermissions: T.GetGroupOrgPermissions = async (
    orgId
) => {
    const response: AxiosResponse<T.IResponse<IGroupPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/group/`);

    if (response.status !== 200) {
        throw new Error('Ошибка в получении групповых разрешений');
    }

    return response.data;
};

export const getGroupAdminOrgPermissions: T.GetGroupAdminOrgPermissions =
    async (orgId) => {
        const response: AxiosResponse<T.IResponse<IAdminGroupPermission>> =
            await $serverAuth.get(`business/${orgId}/permission/admin/group`);

        if (response.status !== 200) {
            throw new Error(
                'Ошибка в получении групповых админских разрешений'
            );
        }

        return response.data;
    };

export const createAdminGroupOrganizationPermission: T.CreateGroupOrgPermission =
    async ({ org, group }) => {
        const response: AxiosResponse<T.IPermissionObject> =
            await $clientAuth.post(`business/${org}/permission/admin/group/`, {
                group,
                org,
            });

        if (response.status !== 201) {
            throw new Error('Ошибка в создании настройки прав доступа');
        }

        return response.data;
    };

export const deleteAdminGroupOrganizationPermission: T.DeleteGroupOrgPermission =
    async ({ id, orgId }) => {
        await $clientAuth.delete(
            `business/${orgId}/permission/admin/group/${id}`
        );
    };
