import * as T from './types';
import { $clientAuth } from 'http/clientIndex';
import { AxiosError, AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const orgId = cookie.get('orgId');

export const getWorkers: T.GetWorkers = async () => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $clientAuth.get(
        `business/${orgId}/worker/`
    );

    return res.data;
};
export const getServerWorkers: T.GetServerWorkers = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $serverAuth.get(
        `business/${orgId}/worker/`
    );

    return res.data;
};

export const getWorker: T.GetWorker = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<T.GetWorker>> = await $serverAuth.get(
        `business/${orgId}/worker/${workerId}`
    );

    return res.data;
};

export const getWorkerUser: T.GetWorkerUser = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerUser>> =
        await $serverAuth.get(`business/${orgId}/worker/${workerId}/user`);

    return res.data;
};

export const createWorkerUser: T.CreateWorkerUser = async (workerId, body) => {
    try {
        await $clientAuth.post(
            `business/${orgId}/worker/${workerId}/user/`,
            body
        );
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 400) {
                throw e;
            }
        }
    }
};

export const getWorkerCard: T.GetWorkerCard = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerCard>> =
        await $serverAuth.get(
            `business/${orgId}/worker/${workerId}/card/?offset=0&ordering=id&limit=10`
        );

    return res.data;
};

export const getWorkerDocs: T.GetClientWorkerDocs = async (workerId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerDocs>> =
        await $clientAuth.get(`business/${orgId}/worker/${workerId}/docs`);

    return res.data;
};

export const getServerWorkerDocs: T.GetWorkerDocs = async (workerId, orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerDocs>> =
        await $serverAuth.get(`business/${orgId}/worker/${workerId}/docs`);

    return res.data;
};

export const deleteWorker: T.DeleteWorker = async (workerId) => {
    await $clientAuth.delete(`business/${orgId}/worker/${workerId}/`);
};
