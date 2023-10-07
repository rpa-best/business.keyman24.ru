import React from 'react';
import { cookies } from 'next/headers';

import { BackButton } from 'components/UI/Buttons/BackButton';
import { getInventoryHistory } from 'http/inventoryApi';
import { HistoryComponent } from 'app/(Main)/components/HistoryComponent';

import scss from './KeyHistoryPage.module.scss';

interface KeyPageProps {
    searchParams: { offset: string };
    params: {
        id: string;
    };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params, searchParams }) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? 0;

    const orgId = cookieStore.get('orgId')?.value as string;

    const keyHistory = await getInventoryHistory(
        +orgId as number,
        +params.id,
        +offset
    );

    return (
        <div className={scss.custom_children}>
            <div className={scss.custom_title_wrapper}>
                <h1>История инвентаря {params.id}</h1>
                <BackButton>Назад</BackButton>
            </div>
            <HistoryComponent type="Inventory" keyHistory={keyHistory} />
        </div>
    );
};

export default KeyPage;
