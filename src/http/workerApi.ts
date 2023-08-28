import * as T from './types';
import { $clientAuth } from 'http/clientIndex';
import { AxiosError, AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const orgId = cookie.get('orgId');

export const getWorkers: T.GetWorkers = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $clientAuth.get(
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

export const getWorkerCard: T.GetWorkerCard = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerCard>> =
        await $serverAuth.get(
            `business/${orgId}/worker/${workerId}/card/?offset=0&ordering=id&limit=10`
        );

    return res.data;
};

export const getServerSideWorkers: T.GetWorkers = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $serverAuth.get(
        `business/${orgId}/worker/`
    );

    return res.data;
};

export const getWorkerDocs: T.GetWorkerDocs = async (workerId, orgId) => {
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
