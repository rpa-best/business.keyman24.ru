import { MainCards } from 'app/(Main)/components/MainCards';

import scss from 'app/(Main)/MainPage.module.scss';

export default function DashboardMain() {
    return (
        <div className={scss.children}>
            <div className={scss.home_wrapper}>
                <h1 className={scss.main_title}>Главное меню</h1>
                <div className={scss.short_info_wrapper}>
                    <MainCards />
                </div>
            </div>
        </div>
    );
}
