'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';

export const InventoryWrapper: React.FC<InventoryWrapperProps> = ({
    inventory,
    count,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);

    const [setNoteVisible] = useModalStore((state) => [state.setVisible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [selectedItem, setSelectedItem] = useState<IModifiedInventory>();
    const [type, setType] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);
    const [selectedItemImage, setSelectedItemImage] = useState<
        IInventoryImage[] | string[]
    >();

    const lastId = useRef<number>();

    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        const ids = inventory.map((i) => {
            return i.id;
        });
        const max = Math.max(...ids);
        lastId.current = max;
    }, []);

    const handleEditClick = async (id: number) => {
        setLoading(true);
        setVisible(true);
        setType('edit');
        const selectedInventory = inventory.find((i) => i.id === id);
        setSelectedItem(selectedInventory);
        const selectedImage = await getInventoryImage(id);
        setSelectedItemImage(selectedImage.results);
        setLoading(false);
    };

    const handleRowClick = async (id: number) => {
        router.push(`${pathname}/${id}`);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteInventoryItem(id)
            .then(() => {
                router.refresh();
                subAction(fields, 'Inventory', 1, 'del');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleTableButtonClick = () => {
        setType('create');
        setSelectedItem(undefined);
        setSelectedItemImage(undefined);
        setVisible(true);
        setNoteVisible(true);
    };

    return (
        <>
            <Table
                buttonData={{
                    onClick: handleTableButtonClick,
                    text: 'Добавить',
                }}
                handleEditClick={handleEditClick}
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteClick}
                tableRows={inventory}
                paginatorData={{ offset: 25, countItems: count }}
                stopPropagation
            >
                <Column sortable header="номер" field="number" />
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Штрихкод" field="codeNumber" />
            </Table>
            <Modal syncWithNote>
                <InventoryModal
                    lastId={lastId.current as number}
                    setSelectedImage={setSelectedItemImage as any}
                    selectedImage={selectedItemImage as []}
                    selectedItem={selectedItem}
                    type={type}
                />
            </Modal>
            <NotificationToast>
                <ServiceChangeToast count={1} slug="Inventory" />
            </NotificationToast>
            {loading && <Spinner />}
        </>
    );
};
