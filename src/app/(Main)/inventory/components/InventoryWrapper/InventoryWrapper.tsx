'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import {
    IModifiedInventory,
    InventoryWrapperProps,
} from 'app/(Main)/inventory/types';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { InventoryModal } from 'app/(Main)/inventory/components/InventoryModal';
import { Spinner } from 'components/Spinner';
import { deleteInventoryItem, getInventoryImage } from 'http/inventoryApi';
import { IInventoryImage } from 'http/types';

export const InventoryWrapper: React.FC<InventoryWrapperProps> = ({
    inventory,
    count,
    inventoryTypes,
}) => {
    const [selectedItem, setSelectedItem] = useState<IModifiedInventory>();
    const [type, setType] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [selectedItemImage, setSelectedItemImage] =
        useState<IInventoryImage[]>();

    const router = useRouter();

    const handleRowClick = async (id: number) => {
        setLoading(true);
        setType('edit');

        const selectedInventory = inventory.find((i) => i.id === id);
        setSelectedItem(selectedInventory);
        const selectedImage = await getInventoryImage(id);
        setSelectedItemImage(selectedImage.results);

        setLoading(false);
        setVisible(true);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteInventoryItem(id).finally(() => setLoading(false));
        router.refresh();
    };

    const handleTableButtonClick = () => {
        setType('create');
        setSelectedItem(undefined);
        setSelectedItemImage(undefined);
        setVisible(true);
    };

    return (
        <>
            <Table
                buttonData={{
                    onClick: handleTableButtonClick,
                    text: 'Добавить',
                }}
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteClick}
                tableRows={inventory}
                paginatorData={{ offset: 10, countItems: count }}
            >
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="номер" field="number" />
            </Table>
            <Modal>
                <InventoryModal
                    setSelectedImage={setSelectedItemImage}
                    selectedImage={selectedItemImage as []}
                    selectedItem={selectedItem}
                    type={type}
                    inventoryTypes={inventoryTypes}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
