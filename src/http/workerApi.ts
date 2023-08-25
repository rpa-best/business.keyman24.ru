import * as T from './types';
import { $clientAuth } from 'http/clientIndex';
import { AxiosResponse } from 'axios';

export const getWorkers: T.GetWorkers = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $clientAuth.get(
        `business/${orgId}/worker/`
    );

    return res.data;
};
