import { cookies } from 'next/headers';

import { getMainCardsStatistics } from 'http/statistics';
import { MainCards } from 'app/(Main)/components/MainCards';

import scss from 'app/(Main)/MainPage.module.scss';

export default async function DashboardMain() {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    /*
    const statistics = await getMainCardsStatistics(+orgId);
*/

    return (
        <div className={scss.children}>
            <div className={scss.home_wrapper}>
                <h1 className={scss.main_title}>Главное меню</h1>
                <div className={scss.short_info_wrapper}>
                    {/*<MainCards statistics={statistics.results[0]} />*/}
                </div>
            </div>
        </div>
    );
}
