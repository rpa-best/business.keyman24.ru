import * as T from './types';
import { $serverAuth } from 'http/serverIndex';
import { AxiosResponse } from 'axios';
import UniversalCookies from 'universal-cookie';
import { $clientAuth } from 'http/clientIndex';
import FormData from 'form-data';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getInventories: T.GetInventories = async (orgId, offset) => {
    const query = new URLSearchParams();
    offset ? query.set('limit', offset.toString()) : query.set('limit', '10');
    offset ? query.set('offset', offset.toString()) : '';

    const res: AxiosResponse<ReturnType<T.GetInventories>> =
        await $serverAuth.get(`business/${orgId}/inventory/`, {
            params: query,
        });

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
    await $clientAuth.post(`business/${orgId}/inventory/`, body);
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
    photo: FileList
) => {
    const formData = new FormData();
    formData.append('image', photo[0]);

    const res = await $clientAuth.post(
        `business/${orgId}/inventory/${itemId}/image/`,
        formData
    );

    return res.data;
};

export const deleteInventoryItemPhoto: T.DeleteInventoryPhoto = async (
    itemId,
    imageId
) => {
    await $clientAuth.delete(
        `business/${orgId}/inventory/${itemId}/image/${imageId}`
    );
};
