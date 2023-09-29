import axios, { AxiosError, AxiosResponse } from 'axios';
import { $serverAuth } from 'http/serverIndex';
import { $host } from 'http/clientIndex';
import * as T from 'http/types';
import { IUser } from 'store/types';
import Cookies from 'universal-cookie';
import process from 'process';

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
            throw error;
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

export const headCheckPathsMiddleware: T.HeadCheckMiddleWare = async (
    path,
    link,
    access,
    orgId
) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}business/${orgId}/` + path,
        {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${access}`,
            },
        }
    );

    if (res.status === 403) {
        return link;
    }
    return;
};
