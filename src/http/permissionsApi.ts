import * as T from 'http/types';
import { $serverAuth } from 'http/serverIndex';
import { AxiosResponse } from 'axios';
import {
    IAdminGroupPermission,
    IAdminPermission,
    IGroupPermission,
} from 'http/types';
import { $clientAuth } from 'http/clientIndex';

import UniversalCookies from 'universal-cookie';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getPermissions: T.GetOrgPermissions = async (orgId: number) => {
    const response: AxiosResponse<T.IPermission[]> = await $serverAuth.get(
        `business/${orgId}/permission?ordering=id`
    );

    if (response.status !== 200) {
        throw new Error('Ошибка в получении данных для настройки прав доступа');
    }

    return response.data;
};

export const getAdminPermissions: T.GetAdminOrgPermissions = async (orgId) => {
    const response: AxiosResponse<T.IResponse<IAdminPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/admin?ordering=id`);

    if (response.status !== 200) {
        throw new Error('Ошибка получения разрешений высшего уровня');
    }

    return response.data;
};

export const getPermLevels: T.GetLevels = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetLevels>> = await $serverAuth.get(
        `business/${orgId}/permission/level`
    );

    return res.data;
};

export const createGroupPerm: T.CreateGroupPerm = async (body) => {
    await $clientAuth.post(`business/${orgId}/permission/group/`, body);
};

export const editGroupPerm: T.EditGroupPerm = async (permId, body) => {
    await $clientAuth.patch(
        `business/${orgId}/permission/group/${permId}/`,
        body
    );
};

export const deleteGroupPerm: T.DeleteGroupPerm = async (permId) => {
    await $clientAuth.delete(`business/${orgId}/permission/group/${permId}/`);
};

export const createAdminPermission: T.CreateOrgPermission = async ({
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

export const getWorkerPermissions: T.GetWorkerPermission = async (
    orgId,
    username
) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/user/${username}/`);

    return res.data;
};

export const createWorkerPermission: T.CreateWorkerPermission = async ({
    permission,
    user,
    type,
}) => {
    await $clientAuth.post(`business/${orgId}/permission/user/${user}/`, {
        permission,
        user,
        type,
    });
};

export const getWorkerGroupPermissions: T.GetWorkerGroupUserPerm = async (
    orgId,
    workerName
) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerGroupUserPerm>> =
        await $serverAuth.get(
            `business/${orgId}/permission/group/user/${workerName}/`
        );

    return res.data;
};

export const createWorkerGroupUser: T.CreateWorkerGroupUser = async (
    workerName,
    body
) => {
    await $clientAuth.post(
        `business/${orgId}/permission/group/user/${workerName}/`,
        body
    );
};

export const deleteWorkerGroupUser: T.DeleteWorkerGroupUser = async (
    workerName,
    groupId
) => {
    await $clientAuth.delete(
        `business/${orgId}/permission/group/user/${workerName}/${groupId}`
    );
};

export const deleteWorkerPermission: T.DeleteWorkerPermission = async (
    user,
    id
) => {
    await $clientAuth.delete(`business/${orgId}/permission/user/${user}/${id}`);
};

export const deleteAdminPermission: T.DeleteOrgPermission = async ({
    id,
    orgId,
}) => {
    await $clientAuth.delete(`business/${orgId}/permission/admin/${id}`);
};

export const getGroupPermissions: T.GetGroupOrgPermissions = async (orgId) => {
    const response: AxiosResponse<T.IResponse<IGroupPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/group/`);

    if (response.status !== 200) {
        throw new Error('Ошибка в получении групповых разрешений');
    }

    return response.data;
};

export const getGroupAdminPermissions: T.GetGroupAdminOrgPermissions = async (
    orgId
) => {
    const response: AxiosResponse<T.IResponse<IAdminGroupPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/admin/group`);

    if (response.status !== 200) {
        throw new Error('Ошибка в получении групповых админских разрешений');
    }

    return response.data;
};

export const createAdminGroupPermission: T.CreateGroupOrgPermission = async ({
    org,
    group,
}) => {
    const response: AxiosResponse<T.IPermissionObject> = await $clientAuth.post(
        `business/${org}/permission/admin/group/`,
        {
            group,
            org,
        }
    );

    if (response.status !== 201) {
        throw new Error('Ошибка в создании настройки прав доступа');
    }

    return response.data;
};

export const deleteAdminGroupPermission: T.DeleteGroupOrgPermission = async ({
    id,
    orgId,
}) => {
    await $clientAuth.delete(`business/${orgId}/permission/admin/group/${id}`);
};
