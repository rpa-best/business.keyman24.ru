'use server';

import axios from 'axios';
import * as process from 'process';
import { snakeToCamelCaseDeep } from 'utils/snakeTOCamelCaseDeep';
import { cookies } from 'next/headers';

export const $serverAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

$serverAuth.interceptors.request.use(async (req) => {
    const cookieStore = cookies();

    const accessToken = cookieStore?.get('access')?.value;

    req.headers.set('Authorization', `Bearer ${accessToken}`);
    return req;
});

$serverAuth.interceptors.response.use((res) => {
    if (res.data) snakeToCamelCaseDeep(res.data);
    return res;
});
