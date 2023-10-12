import * as T from './types';
import { $serverAuth } from 'http/serverIndex';
import { AxiosError, AxiosResponse } from 'axios';
import UniversalCookies from 'universal-cookie';
import { $clientAuth } from 'http/clientIndex';
import FormData from 'form-data';
import { toast } from 'react-toastify';
import { errorToastOptions } from 'config/toastConfig';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getInventories: T.GetInventories = async (orgId, offset) => {
    const query = new URLSearchParams();
    query.set('limit', '25');
    offset ? query.set('offset', offset.toString()) : '';

    const res: AxiosResponse<ReturnType<typeof getInventories>> =
        await $serverAuth.get(`business/${orgId}/inventory/?type=inventory`, {
            params: query,
        });

    return res.data;
};

export const getClientInventories: T.GetClientInventories = async () => {
    const res: AxiosResponse<ReturnType<T.GetInventories>> =
        await $clientAuth.get(`business/${orgId}/inventory/?type=inventory`);

    return res.data;
};

export const getInventoryHistory: T.GetInventoryHistory = async (
    orgId,
    inventoryId,
    offset
) => {
    const query = new URLSearchParams();
    query.set('limit', '30');
    offset ? query.set('offset', offset.toString()) : '';

    const res: AxiosResponse<ReturnType<typeof getInventoryHistory>> =
        await $serverAuth.get(
            `business/${orgId}/inventory/${inventoryId}/history`,
            { params: query }
        );

    return res.data;
};

export const getInventoryTypes: T.GetInventoryTypes = async (orgId) => {
    const res: AxiosResponse<ReturnType<T.GetInventoryTypes>> =
        await $serverAuth.get(`business/${orgId}/inventory/type`);

    return res.data;
};

export const getInventoryImage: T.GetInventoryImage = async (invId) => {
    const res: AxiosResponse<ReturnType<T.GetInventoryImage>> =
        await $clientAuth.get(`business/${orgId}/inventory/${invId}/image/`);

    return res.data;
};

export const createInventoryItem: T.CreateInventoryItem = async (body) => {
    const res = await $clientAuth.post(`business/${orgId}/inventory/`, body);

    return res.data;
};

export const updateInventoryItem: T.UpdateInventoryItem = async (
    inventoryId,
    body
) => {
    await $clientAuth.patch(
        `business/${orgId}/inventory/${inventoryId}/`,
        body
    );
};

export const deleteInventoryItem = async (itemId: number) => {
    await $clientAuth.delete(`business/${orgId}/inventory/${itemId}/`);
};

export const uploadInventoryPhoto: T.UploadInventoryPhoto = async (
    itemId: number,
    photo: File
) => {
    const formData = new FormData();
    formData.append('image', photo);
    try {
        const res = await $clientAuth.post(
            `business/${orgId}/inventory/${itemId}/image/`,
            formData
        );

        return res.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 400) {
                toast('Неверный формат изображения', errorToastOptions);
            }
        }
    }
};

export const deleteInventoryItemPhoto: T.DeleteInventoryPhoto = async (
    itemId,
    imageId
) => {
    await $clientAuth.delete(
        `business/${orgId}/inventory/${itemId}/image/${imageId}`
    );
};

export const createInventoryKeys: T.CreateInventoryCode = async (body) => {
    await $clientAuth.post(
        `business/${orgId}/inventory/inventory-generate/`,
        body
    );
};
