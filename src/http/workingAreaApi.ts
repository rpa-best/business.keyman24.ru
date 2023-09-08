import * as T from './types';
import { AxiosError, AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';
import { $clientAuth } from 'http/clientIndex';
import UniversalCookies from 'universal-cookie';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId') ?? 1;

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

export const createWorkingArea: T.CreateWorkingArea = async (body) => {
    try {
        await $clientAuth.post(`business/${orgId}/working_area/`, body);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error('Ошибка в создании рабочего места');
        }
    }
};

export const patchWorkingArea: T.PatchWorkingArea = async (body, areaId) => {
    try {
        await $clientAuth.patch(
            `business/${orgId}/working_area/${areaId}/`,
            body
        );
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error('Ошибка в обновлении рабочего места');
        }
    }
};

export const deleteWorkingArea: T.DeleteWorkingArea = async (id) => {
    try {
        await $clientAuth.delete(`business/${orgId}/working_area/${id}`);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error('Ошибка в удалении рабочего места');
        }
    }
};

export const getSessions: T.GetAreaSessions = async (
    orgId,
    areaId,
    archive
) => {
    const query = new URLSearchParams();
    archive ? query.set('is_archive', archive) : '';
    const res: AxiosResponse<ReturnType<T.GetAreaSessions>> =
        await $serverAuth.get(
            `business/${orgId}/working_area/${areaId}/session/?ordering=-status`,
            {
                params: query,
            }
        );
    return res.data;
};

export const getSessionLog: T.GetSessionLog = async (
    orgId,
    areaId,
    sessionId
) => {
    const res: AxiosResponse<ReturnType<T.GetSessionLog>> =
        await $serverAuth.get(
            `business/${orgId}/working_area/${areaId}/session/${sessionId}/element`
        );

    return res.data;
};

export const closeSession: T.CloseSession = async (areaId, sessionId) => {
    try {
        await $clientAuth.delete(
            `business/${orgId}/working_area/${areaId}/session/${sessionId}/`
        );
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error('Ошибка в закрытии сессии');
        }
    }
};

export const createSession: T.CreateSession = async (areaId, body) => {
    try {
        await $clientAuth.post(
            `business/${orgId}/working_area/${areaId}/session/`,
            body
        );
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            throw new Error('Ошибка в создании рабочей сессии');
        }
    }
};

export const sendCheck: T.SendCheckSession = async (
    areaId,
    sessionId,
    body
) => {
    await $clientAuth.patch(
        `business/${orgId}/working_area/${areaId}/session/${sessionId}/check/`,
        body
    );
};

export const sendActivateSession: T.SendActivateSession = async (
    areaId,
    sessionId
) => {
    await $clientAuth.post(
        `business/${orgId}/working_area/${areaId}/session/${sessionId}/activate/`
    );
};
export const sendSessionAction: T.SendSessionAction = async (
    areaId,
    sessionId,
    body
) => {
    await $clientAuth.post(
        `business/${orgId}/working_area/${areaId}/session/${sessionId}/use/`,
        body
    );
};
