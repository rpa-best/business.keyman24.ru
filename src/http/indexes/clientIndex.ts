import axios, { AxiosError } from 'axios';
import CookiesUniversal from 'universal-cookie';
import { snakeToCamelCaseDeep } from 'utils/snakeTOCamelCaseDeep';
import { toast } from 'react-toastify';
import { errorToastOptions, warningToastConfig } from 'config/toastConfig';

const cookiesUni = new CookiesUniversal();

export const $host = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const $clientAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

$clientAuth.interceptors.request.use(async (req) => {
    const accessToken = cookiesUni.get('access');

    req.headers.set('Authorization', `Bearer ${accessToken}`);
    return req;
});

[$clientAuth, $host].forEach((item) => {
    item.interceptors.response.use(
        (res) => {
            if (res.data) snakeToCamelCaseDeep(res.data);
            return res;
        },
        (error: AxiosError) => {
            const method = error.response?.config.method;
            if (
                method !== 'get' &&
                method !== 'head' &&
                error.response?.status === 403
            ) {
                toast('Недостаточно прав', warningToastConfig);
            } else if ((error.response?.status as any) >= 500) {
                toast('Ошибка сервера', errorToastOptions);
            }
            throw error;
        }
    );
});
