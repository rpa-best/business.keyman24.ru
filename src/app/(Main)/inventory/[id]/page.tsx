import React from 'react';
import { cookies } from 'next/headers';
import { getInventoryHistory } from 'http/inventoryApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

interface InventoryPageProps {
    params: { id: string };
}

const InventoryPage: React.FC<InventoryPageProps> = async ({ params }) => {
    const cookieStore = cookies();

    const inventoryId = params.id;

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const inventoryHistory = await getInventoryHistory(+orgId, +inventoryId);

    console.log(inventoryHistory);

    return (
        <>
            <BackButton>Назад</BackButton>
            {JSON.stringify(inventoryHistory)}
        </>
    );
};

export default InventoryPage;
