import * as T from 'http/types';
import { $serverAuth } from 'http/indexes/serverIndex';
import { AxiosError, AxiosResponse } from 'axios';
import {
    IAdminGroupPermission,
    IAdminPermission,
    IGroupPermission,
} from 'http/types';
import { $clientAuth } from 'http/indexes/clientIndex';

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

export const getClientAllPermissions: T.GetOrgPermissionsOnClient =
    async () => {
        const response: AxiosResponse<T.IPermission[]> = await $clientAuth.get(
            `business/${orgId}/permission?ordering=id`
        );

        if (response.status !== 200) {
            throw new Error(
                'Ошибка в получении данных для настройки прав доступа'
            );
        }

        return response.data;
    };

export const getClientPermissions: T.GetClientOrgPermissions = async (
    level
) => {
    const query = new URLSearchParams();
    level ? query.set('level', level) : '';
    const response: AxiosResponse<T.IPermission[]> = await $clientAuth.get(
        `business/${orgId}/permission?ordering=id`,
        {
            params: query,
        }
    );

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

export const getAdminPermissionsOnClient: T.GetAdminOrgPermissionsOnClient =
    async () => {
        const response: AxiosResponse<T.IResponse<IAdminPermission>> =
            await $clientAuth.get(
                `business/${orgId}/permission/admin?ordering=id`
            );

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
    const res = await $clientAuth.post(
        `business/${orgId}/permission/group/`,
        body
    );
    return res.data;
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
    type,
}) => {
    const response: AxiosResponse<T.IPermissionObject> = await $clientAuth.post(
        `business/${orgId}/permission/admin/`,
        {
            permission,
            orgId,
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

export const getWorkerPermissionsOnClient: T.GetWorkerPermissionOnClient =
    async (username) => {
        const res: AxiosResponse<
            ReturnType<typeof getWorkerPermissionsOnClient>
        > = await $clientAuth.get(
            `business/${orgId}/permission/user/${username}/`
        );

        return res.data;
    };

export const createWorkerPermission: T.CreateWorkerPermission = async ({
    permission,
    user,
    type,
}) => {
    const res = await $clientAuth.post(
        `business/${orgId}/permission/user/${user}/`,
        {
            permission,
            user,
            type,
        }
    );

    return res.data;
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
export const getWorkerGroupPermissionsOnClient: T.GetWorkerGroupPermissionOnClient =
    async (workerName) => {
        const res: AxiosResponse<
            ReturnType<typeof getWorkerGroupPermissionsOnClient>
        > = await $clientAuth.get(
            `business/${orgId}/permission/group/user/${workerName}/`
        );

        return res.data;
    };

export const createWorkerGroupUser: T.CreateWorkerGroupUser = async (
    workerName,
    body
) => {
    const res = await $clientAuth.post(
        `business/${orgId}/permission/group/user/${workerName}/`,
        body
    );
    return res.data;
};

export const deleteWorkerGroupUser: T.DeleteWorkerGroupUser = async (
    workerName,
    groupId
) => {
    return await $clientAuth.delete(
        `business/${orgId}/permission/group/user/${workerName}/${groupId}`
    );
};

export const deleteWorkerPermission: T.DeleteWorkerPermission = async (
    user,
    id
) => {
    return await $clientAuth.delete(
        `business/${orgId}/permission/user/${user}/${id}`
    );
};

export const deleteAdminPermission: T.DeleteOrgPermission = async ({ id }) => {
    const res = await $clientAuth.delete(
        `business/${orgId}/permission/admin/${id}`
    );
    if (res.status === 204) {
        return true;
    }
};

export const getGroupPermissions: T.GetGroupOrgPermissions = async (
    orgId,
    offset
) => {
    const query = new URLSearchParams();
    if (offset) {
        query.set('offset', offset.toString());
        query.set('limit', '15');
    }

    const response: AxiosResponse<T.IResponse<IGroupPermission>> =
        await $serverAuth.get(`business/${orgId}/permission/group/`, {
            params: query,
        });

    if (response.status !== 200) {
        throw new Error('Ошибка в получении групповых разрешений');
    }

    return response.data;
};
export const getGroupPermissionsOnClient: T.GetGroupOrgPermissionsOnClient =
    async () => {
        const response: AxiosResponse<T.IResponse<IGroupPermission>> =
            await $clientAuth.get(`business/${orgId}/permission/group/`);

        if (response.status !== 200) {
            throw new Error('Ошибка в получении групповых разрешений');
        }

        return response.data;
    };

export const getPermissionGroupPermission: T.GetPermGroupPermissions = async (
    permGroup
) => {
    const response: AxiosResponse<ReturnType<T.GetPermGroupPermissions>> =
        await $clientAuth.get(
            `business/${orgId}/permission/group/${permGroup}/permission`
        );

    return response.data;
};

export const createPermissionGroupPermission: T.CreatePermGroupPermissions =
    async (permGroup, permId, type) => {
        const body = {
            group: permGroup,
            permission: permId,
            type: type,
        };
        const res = await $clientAuth.post(
            `business/${orgId}/permission/group/${permGroup}/permission/`,
            body
        );
        return res.data;
    };

export const deletePermissionGroupPermission: T.DeletePermGroupPermissions =
    async (permGroup, permId) => {
        return await $clientAuth.delete(
            `business/${orgId}/permission/group/${permGroup}/permission/${permId}/`
        );
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

export const getGroupAdminPermissionsOnClient: T.GetGroupAdminOrgPermissionsOnClient =
    async () => {
        const response: AxiosResponse<T.IResponse<IAdminGroupPermission>> =
            await $clientAuth.get(`business/${orgId}/permission/admin/group`);

        if (response.status !== 200) {
            throw new Error(
                'Ошибка в получении групповых админских разрешений'
            );
        }

        return response.data;
    };

export const createAdminGroupPermission: T.CreateGroupOrgPermission = async ({
    group,
}) => {
    const response: AxiosResponse<T.IPermissionObject> = await $clientAuth.post(
        `business/${orgId}/permission/admin/group/`,
        {
            group,
            orgId,
        }
    );

    if (response.status !== 201) {
        throw new Error('Ошибка в создании настройки прав доступа');
    }

    return response.data;
};

export const deleteAdminGroupPermission: T.DeleteGroupOrgPermission = async ({
    id,
}) => {
    try {
        await $clientAuth.delete(
            `business/${orgId}/permission/admin/group/${id}`
        );
        return true;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw e;
        }
    }
};
