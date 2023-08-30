import React from 'react';

import { InventoryWrapper } from 'app/(Main)/inventory/components/InventoryWrapper';
import { getInventories, getInventoryTypes } from 'http/inventoryApi';
import { IModifiedInventory } from 'app/(Main)/inventory/types';
import { cookies } from 'next/headers';

import scss from './inventory.module.scss';

interface InventoryPageProps {
    searchParams: { offset: string };
}

const InventoryPage: React.FC<InventoryPageProps> = async ({
    searchParams,
}) => {
    const offset = searchParams.offset ?? 0;

    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const inventories = await getInventories(+orgId, +offset);

    const inventoryTypes = await getInventoryTypes(+orgId);

    const modifiedInventory: IModifiedInventory[] = inventories.results.map(
        (i) => {
            return { ...i, type: i.type.name };
        }
    );

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Инвентарь</h2>
            <InventoryWrapper
                inventoryTypes={inventoryTypes.results}
                count={inventories.count}
                inventory={modifiedInventory}
            />
        </div>
    );
};

export default InventoryPage;
