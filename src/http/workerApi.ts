import * as T from './types';
import { $clientAuth } from 'http/clientIndex';
import { AxiosResponse } from 'axios';

export const getWorkers: T.GetWorkers = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $clientAuth.get(
        `business/${orgId}/worker/`
    );

    return res.data;
};

export const getWorkerDocs: T.GetWorkerDocs = async (workerId, orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkerDocs>> =
        await $clientAuth.get(`business/${orgId}/worker/${workerId}/docs`);

    return res.data;
};
