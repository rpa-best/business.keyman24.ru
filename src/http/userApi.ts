import { AxiosError, AxiosResponse } from 'axios';
import { $clientAuth, $host } from 'http/indexes/clientIndex';
import * as T from 'http/types';
import Cookies from 'universal-cookie';
import * as process from 'process';

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

        return response.data as any;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw error;
        }
    }
};

export const getUser: T.GetUserType = async (access) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}account/me/`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            },
            next: {
                revalidate: 60,
            },
        }
    );
    return await response.json();
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

export const checkEmail = async (email: string) => {
    const res = await $clientAuth.post(
        'account/check-email/?place=change_password',
        {
            email,
        }
    );

    return res.data;
};

export const changePassword: T.ChangePassword = async (
    pvc,
    email: string,
    password1,
    password2
) => {
    const res = await $clientAuth.post('account/change-password/', {
        email,
        password1,
        password2,
        pvc,
    });

    return res.data;
};

export const headCheckPathsMiddleware: T.HeadCheckMiddleWare = async (
    path,
    link,
    access,
    orgId
) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}business/${orgId}/${path}?offset=0&limit=1`,
        {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${access}`,
            },
        }
    );

    if (res.status === 200) {
        return;
    }
    return link;
};

export const allowedPath: T.AllowedPath = async (path, org) => {
    const res = await $clientAuth.head(
        `business/${org}/${path}?offset=0&limit=1`
    );
    return res.status === 200;
};
