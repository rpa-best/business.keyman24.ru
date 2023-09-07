import React from 'react';
import { cookies } from 'next/headers';

import { getKeyHistory } from 'http/locationsApi';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { BarChart } from 'components/Charts/BarChart';

import scss from './KeyHistoryPage.module.scss';
import {
    formatDateHistory,
    getBarData,
    getOrgBarData,
} from 'helpers/historyHelper';
import { PieChart } from 'components/Charts/PieChart/PieChart';

interface KeyPageProps {
    params: {
        locId: string;
        objId: string;
        keyId: string;
    };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const keyHistory = await getKeyHistory(
        +orgId,
        +params.locId,
        +params.objId,
        +params.keyId
    );

    const cloneHistory = formatDateHistory(keyHistory.results);

    const { barData, barLabels } = getBarData(cloneHistory);

    const { labels, data } = getOrgBarData(cloneHistory);

    return (
        <>
            <div className={scss.custom_title_wrapper}>
                <h1>История ключа {params.keyId}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            {barData?.length !== 0 ? (
                <>
                    <div className={scss.bar_chart_wrapper}>
                        <h2 className={scss.custom_title}>
                            Время у работников
                        </h2>
                        <BarChart
                            labels={barLabels}
                            data={barData}
                            dataLabels="Время в часах"
                        />
                    </div>
                    <div className={scss.pie_chart_wrapper}>
                        <h2 className={scss.custom_title}>
                            Время по организациям
                        </h2>
                        <PieChart
                            labels={labels}
                            data={data}
                            dataLabels="Время в часах"
                        />
                    </div>
                </>
            ) : (
                <p className={scss.empty_key}>Этот ключ ещё не использовался</p>
            )}
        </>
    );
};

export default KeyPage;
