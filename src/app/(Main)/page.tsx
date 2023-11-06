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

interface DashboardProps {
    searchParams: {
        org: string;
        date_it: string;
        date_gt: string;
    };
}

export default async function DashboardMain({
    searchParams: { org, date_gt, date_it },
}: DashboardProps) {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    /*
    const mainCardsStatistics = await getMainCardsStatistics(+orgId);
*/

    const orgs = await getOrganizations();

    const allOrgs = await getOrganizationContractors(+orgId);

    const orgQuery = org ?? orgs[0].id;

    const dateItQuery = date_it ?? formatDate(new Date());

    const dateGtQuery =
        date_gt ??
        formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));

    const lineChartData = await getLineChartData(+orgId, {
        orgs: orgQuery,
        date_gt: dateGtQuery,
        date_it: dateItQuery,
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.home_wrapper}>
                <h1 className={scss.page_title_with_table}>Главное меню</h1>
                <div className={scss.short_info_wrapper}>
                    {/* <MainCards statistics={mainCardsStatistics.results[0]} />*/}
                </div>
                <FiltersContainer contractors={allOrgs} org={orgs[0]} />
                <LineChart chartData={lineChartData} />
            </div>
        </div>
    );
}
