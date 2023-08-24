import axios from 'axios';
import process from 'process';
import CookiesUniversal from 'universal-cookie';
import { snakeToCamelCaseDeep } from 'utils/snakeTOCamelCaseDeep';
import { $serverAuth } from 'http/serverIndex';

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
    item.interceptors.response.use((res) => {
        if (res.data) snakeToCamelCaseDeep(res.data);
        return res;
    });
});
