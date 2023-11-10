import { cookies } from 'next/headers';

import { getLineChartData, getMainCardsStatistics } from 'http/statistics';
import { MainCards } from 'app/(Main)/components/MainCards';

import { LineChart } from 'app/(Main)/components/LineChart';
import { FiltersContainer } from 'app/(Main)/components/FiltersContainer';
import {
    getOrganizationContractors,
    getOrganizations,
} from 'http/organizationApi';

import scss from 'app/(Main)/MainPage.module.scss';
import { formatDate } from 'utils/formatDate';
import { QueryIntervalType } from 'app/(Main)/components/LineChart/LineChart';
import { AxiosError } from 'axios';
import { FiltersAndLineChart } from 'app/(Main)/components/FiltersAndLineChart';

interface DashboardProps {
    searchParams: {
        org: string;
        date_lt: string;
        date_gt: string;
        interval: QueryIntervalType;
    };
}

export default async function DashboardMain({
    searchParams: { org, date_gt, date_lt, interval },
}: DashboardProps) {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const mainCardsStatistics = await getMainCardsStatistics(+orgId);

    const orgs = await getOrganizations();

    const allOrgs = await getOrganizationContractors(+orgId);

    const intervalQuery = interval ?? 'byDay';

    const orgQuery = org ?? orgs[0].id;

    let dateGtQuery;

    let dateLtQuery;

    switch (intervalQuery) {
        case 'byHour': {
            dateGtQuery = date_gt ?? formatDate(new Date(), 'gt');
            dateLtQuery = date_lt ?? formatDate(new Date(), 'lg');
            break;
        }
        case 'byDay': {
            dateGtQuery =
                date_gt ??
                formatDate(
                    new Date(new Date().setMonth(new Date().getMonth() - 1))
                );
            dateLtQuery = date_lt ?? formatDate(new Date());
            break;
        }
        case 'byMonth': {
            dateGtQuery =
                date_gt ??
                formatDate(
                    new Date(new Date().setMonth(new Date().getMonth() - 1))
                );
            dateLtQuery = date_lt ?? formatDate(new Date());
            break;
        }

        default: {
            dateGtQuery =
                date_gt ??
                formatDate(
                    new Date(new Date().setMonth(new Date().getMonth() - 1))
                );
            dateLtQuery = date_lt ?? formatDate(new Date());
            break;
        }
    }

    const lineChartData = await getLineChartData(+orgId, {
        orgs: orgQuery,
        date_gt: dateGtQuery,
        date_lt: dateLtQuery,
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.home_wrapper}>
                <h1 className={scss.page_title_with_table}>Главное меню</h1>
                <div className={scss.short_info_wrapper}>
                    <MainCards statistics={mainCardsStatistics} />
                </div>
                <FiltersAndLineChart
                    allOrgs={allOrgs}
                    org={orgs[0]}
                    lineChartData={lineChartData}
                />
            </div>
        </div>
    );
}
