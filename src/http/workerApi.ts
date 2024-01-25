import * as T from 'http/types';
import { $clientAuth } from 'http/indexes/clientIndex';
import { AxiosResponse } from 'axios';
import { $serverAuth } from 'http/indexes/serverIndex';
import Cookies from 'universal-cookie';
import FormData from 'form-data';

const cookie = new Cookies();

const orgId = cookie.get('orgId');

export const getWorkers: T.GetWorkers = async (org, guest) => {
    const query = new URLSearchParams();
    org ? query.set('org', org.toString()) : '';
    if (guest !== undefined) {
        guest ? query.set('guest', 'true') : query.set('guest', 'false');
    }
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $clientAuth.get(
        `business/${orgId}/worker/`,
        {
            params: query,
        }
    );

    return res.data;
};

export const getWorkerPlan: T.GetWorkerPlan = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<typeof getWorkerPlan>> =
        await $serverAuth.get(
            `business/${orgId}/worker/plan/${workerId}?ordering=-date`
        );

    return res.data;
};
export const getWorkersPlan: T.GetWorkersPlan = async (query) => {
    const queryParams = new URLSearchParams();
    if (query) {
        for (const elem of Object.keys(query)) {
            if (query[elem]) {
                queryParams.set(elem, query[elem] as string);
            }
        }
    }

    const res: AxiosResponse<ReturnType<typeof getWorkersPlan>> =
        await $clientAuth.get(`business/${orgId}/worker/plan/`, {
            responseType: 'blob',
            params: queryParams,
        });

    return res.data;
};
export const getServerWorkers: T.GetServerWorkers = async (
    orgId,
    offset,
    guest
) => {
    const query = new URLSearchParams();
    if (offset) {
        query.set('limit', '25');
        query.set('offset', offset);
    }
    if (guest !== undefined) {
        guest ? query.set('guest', 'true') : query.set('guest', 'false');
    }
    const res: AxiosResponse<ReturnType<T.GetWorkers>> = await $serverAuth.get(
        `business/${orgId}/worker/`,
        { params: query }
    );

    return res.data;
};

export const getServerQrcodes: T.GetServerQrcodes = async (orgId, workerId) => {
    const res: AxiosResponse<ReturnType<typeof getServerQrcodes>> =
        await $serverAuth.get(`business/${orgId}/worker/${workerId}/qrcode`);

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
    await $clientAuth.post(`business/${orgId}/worker/${workerId}/user/`, body);
};

export const createTemporaryWorker: T.CreateTemporaryWorker = async (body) => {
    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('desc', body.desc);
    body.image && formData.append('image', body.image);

    const res = await $clientAuth.post(`business/${orgId}/worker/`, formData);
    return res.data;
};

export const createTemporaryWorkerQrCode: T.CreateTemporaryWorkerQrcode =
    async (workerId, body) => {
        const res = await $clientAuth.post(
            `business/${orgId}/worker/${workerId}/qrcode/`,
            body
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

export const updateUserImg: (
    image: FileList,
    workerId: number
) => Promise<{ image: string }> = async (image, workerId) => {
    const formData = new FormData();
    formData.append('image', image.item(0) as Blob);
    const res = await $clientAuth.put(
        `business/${orgId}/worker/${workerId}/`,
        formData
    );
    return res.data;
};

export const createWorkerDocument: T.CreateWorkerDocument = async (
    workerId,
    body
) => {
    const res: AxiosResponse<ReturnType<typeof createWorkerDocument>> =
        await $clientAuth.post(
            `business/${orgId}/worker/${workerId}/docs/`,
            body
        );

    return res.data;
};
