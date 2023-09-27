import { AxiosError, AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';
import { $clientAuth, $host } from 'http/clientIndex';
import * as T from 'http/types';
import { IUser } from 'store/types';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

const orgId = cookie.get('orgId');

export const userAuth: T.UserAuthType = async (body) => {
    try {
        const response: AxiosResponse<T.IUserAuthResponse> = await $host.post(
            'account/auth/?login_params=username_password',
            body
        );

        cookie.set('refresh', response.data.refresh);
        cookie.set('access', response.data.access);

        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message[0].desc);
        }
        return error;
    }
};

export const getUser: T.GetUserType = async () => {
    try {
        const response: AxiosResponse<IUser> = await $serverAuth.get(
            'account/me/'
        );
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                /*if (await updateTokens()) {
                    return await getUser();
                } else {*/
                throw error;
            }
        }
    }
};

export const updateTokens: T.UpdateTokens = async () => {
    const refresh = cookie.get('refresh');

    const setTokens = async (response: AxiosResponse<T.IUserAuthResponse>) => {
        cookie.set('access', response.data.access);
        cookie.set('refresh', response.data.refresh);
    };

    try {
        const response: AxiosResponse<T.IUserAuthResponse> = await $host.post(
            'account/refresh-token/',
            refresh
        );

        await setTokens(response);

        return true;
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 401) {
                return false;
            }
        }
        return false;
    }
};

export const headCheckPaths: T.HeadCheck = async (path, link, orgId) => {
    const res = await $serverAuth.get(`business/${orgId}/` + path);

    if (res.status !== 200) {
        return link;
    } else {
        return;
    }
};

export const headCheckPathsClient: T.ClientHeadCheck = async (path, link) => {
    const res = await $clientAuth.head(`business/${orgId}/` + path);

    if (res.status !== 200) {
        return link;
    } else {
        return;
    }
};
