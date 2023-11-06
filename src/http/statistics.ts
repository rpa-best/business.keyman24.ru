import * as T from './types';
import { $serverAuth } from 'http/indexes/serverIndex';
import { AxiosError, AxiosResponse } from 'axios';
import UniversalCookies from 'universal-cookie';
import { $clientAuth } from 'http/indexes/clientIndex';

const cookie = new UniversalCookies();

const orgId = cookie.get('orgId');

export const getMainCardsStatistics: T.GetMainCardsStatistics = async (
    orgId
) => {
    const res: AxiosResponse<ReturnType<typeof getMainCardsStatistics>> =
        await $serverAuth.get(`business/${orgId}/statistics/home/donat-chart/`);

    return res.data;
};

export const getLineChartData: T.GetLineChartData = async (
    orgId,
    { orgs, date_it, date_gt }
) => {
    const query = new URLSearchParams();
    query.set('org', orgs);
    /*    query.set('date_it', date_it);
    query.set('date_gt', date_gt);*/

    const res: AxiosResponse<ReturnType<typeof getLineChartData>> =
        await $serverAuth.get(`business/${orgId}/statistics/home/line-chart/`, {
            params: query,
        });

    return res.data;
};
