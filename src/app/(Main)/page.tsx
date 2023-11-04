import { cookies } from 'next/headers';

import { getLineChartData, getMainCardsStatistics } from 'http/statistics';
import { MainCards } from 'app/(Main)/components/MainCards';

import { LineChart } from 'app/(Main)/components/FiltersContainer/components/LineChart';
import { FiltersContainer } from 'app/(Main)/components/FiltersContainer';
import {
    getOrganizationContractors,
    getOrganizations,
} from 'http/organizationApi';

import scss from 'app/(Main)/MainPage.module.scss';

interface DashboardProps {
    searchParams: { org: string };
}

export default async function DashboardMain({
    searchParams: { org },
}: DashboardProps) {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    /*
    const mainCardsStatistics = await getMainCardsStatistics(+orgId);
*/

    const orgs = await getOrganizations();

    const allOrgs = await getOrganizationContractors(+orgId);

    const lineChartData = await getLineChartData(+orgId);

    return (
        <div className={scss.children_with_table}>
            <div className={scss.home_wrapper}>
                <h1 className={scss.page_title_with_table}>Главное меню</h1>
                <div className={scss.short_info_wrapper}>
                    {/* <MainCards statistics={mainCardsStatistics.results[0]} />*/}
                </div>
                <LineChart chartData={lineChartData} />
                <FiltersContainer contractors={allOrgs} org={orgs[0]} />
            </div>
        </div>
    );
}
