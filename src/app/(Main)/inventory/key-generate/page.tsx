import React from 'react';
import { cookies } from 'next/headers';

import { KeysPageProps } from 'app/(Main)/inventory/key-generate/types';
import { InventoryKeysWrapper } from 'app/(Main)/inventory/key-generate/components/InventoryKeysWrapper';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { getInventories } from 'http/inventoryApi';

import scss from './KeysPage.module.scss';

const KeysPage: React.FC<KeysPageProps> = async () => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const inventories = await getInventories(+orgId);

    return (
        <div className={scss.children_with_table}>
            <div className={scss.title_wrapper}>
                <h2 className={scss.page_title_with_table}>Ключи</h2>
                <div>
                    <BackButton>Назад</BackButton>
                </div>
            </div>
            <InventoryKeysWrapper
                inventories={inventories.results}
                count={inventories.count}
            />
        </div>
    );
};

export default KeysPage;
