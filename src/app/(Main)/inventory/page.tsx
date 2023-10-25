import React from 'react';

import { InventoryWrapper } from 'app/(Main)/inventory/components/InventoryWrapper';
import { getInventories } from 'http/inventoryApi';
import { IModifiedInventory } from 'app/(Main)/inventory/types';
import { cookies } from 'next/headers';

import scss from './inventory.module.scss';

interface InventoryPageProps {
    searchParams: { offset: string; name: string; location: string };
}

const InventoryPage: React.FC<InventoryPageProps> = async ({
    searchParams,
}) => {
    const offset = searchParams.offset ?? 0;
    const name = searchParams.name ?? 'Все';
    const location = searchParams.location ?? 'Все';

    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value as string;

    const inventories = await getInventories(+orgId, +offset, name, location);

    const modifiedInventory: IModifiedInventory[] = inventories.results.map(
        (i) => {
            const location = i.location === null ? '-' : `${i.location.name}`;
            return { ...i, type: i.type.name, location: location };
        }
    );

    return (
        <div className={scss.children_with_table}>
            <div className={scss.title_wrapper}>
                <h2 className={scss.title_text_wrapper}>Инвентарь</h2>
            </div>
            <InventoryWrapper
                count={inventories.count}
                inventory={modifiedInventory}
            />
        </div>
    );
};

export default InventoryPage;
