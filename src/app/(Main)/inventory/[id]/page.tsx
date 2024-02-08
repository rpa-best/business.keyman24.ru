import React from 'react';
import { cookies } from 'next/headers';

import { BackButton } from 'components/UI/Buttons/BackButton';
import { getInventoryById, getInventoryHistory } from 'http/inventoryApi';
import { HistoryComponent } from 'app/(Main)/components/HistoryComponent';

import scss from './KeyHistoryPage.module.scss';

interface KeyPageProps {
    searchParams: { offset: string; register: boolean };
    params: {
        id: string;
    };
}

const InventoryPage: React.FC<KeyPageProps> = async ({
    params,
    searchParams,
}) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? 0;

    const orgId = cookieStore.get('orgId')?.value as string;

    const inventoryHistory = await getInventoryHistory(
        +orgId as number,
        +params.id,
        +offset,
        searchParams.register
    );

    const inventory = await getInventoryById(+orgId, +params.id);

    const inventoryStatus = inventory.status ? 'На руках' : 'На складе';

    return (
        <div className={scss.custom_children}>
            <div className={scss.custom_title_wrapper}>
                <h1>История инвентаря {params.id}</h1>
                <BackButton>Назад</BackButton>
            </div>
            <HistoryComponent
                cost={inventory.cost}
                status={inventoryStatus}
                register={searchParams.register}
                type="Inventory"
                keyHistory={inventoryHistory}
            />
        </div>
    );
};

export default InventoryPage;
