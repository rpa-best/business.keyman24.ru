'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
import {
    deleteInventoryItem,
    getClientInventories,
    getInventoryImage,
} from 'http/inventoryApi';
import { IData } from 'app/(Main)/locations/types';
import { IInventoryImage } from 'http/types';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';
import { ActionsButtons } from 'app/(Main)/inventory/components/ActionsButtons';
import { MoreInventoryModal } from 'app/(Main)/inventory/components/MoreInventoryModal';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';

export const InventoryWrapper: React.FC<InventoryWrapperProps> = ({
    inventory,
    count,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const path = usePathname();

    const [modalType, setModalType] = useState<'one' | 'more'>('one');
    const [type, setType] = useState<'create' | 'edit'>('create');

    const [setNoteVisible] = useModalStore((state) => [state.setVisible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const [selectedItem, setSelectedItem] = useState<IModifiedInventory>();
    const [selectedItemImage, setSelectedItemImage] = useState<
        IInventoryImage[] | string[]
    >();
    const [generatedData, setGeneratedData] = useState<IModifiedInventory[]>(
        []
    );
    const [rowFormData, setRowFormData] = useState<IData[]>([]);

    const total = rowFormData.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.count;
    }, 0);

    useEffect(() => {
        setGeneratedData(inventory);
    }, [inventory]);

    const handleEditClick = async (id: number) => {
        setLoading(true);
        setVisible(true);
        setType('edit');
        const selectedInventory = generatedData.find((i) => i.id === id);
        setSelectedItem(selectedInventory);
        await getInventoryImage(id).then((d) => {
            setSelectedItemImage(d.results);
        });
        setLoading(false);
    };

    const handleRowClick = async (id: number) => {
        router.push(`${pathname}/${id}`);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteInventoryItem(id).finally(() => {
            revalidate(path);
            setLoading(false);
        });
    };

    const handleTableButtonClick = () => {
        setType('create');
        setModalType('one');
        setSelectedItem(undefined);
        setSelectedItemImage(undefined);
        setVisible(true);
        setNoteVisible(true);
    };

    return (
        <>
            <div className={scss.keys}>
                <ActionsButtons
                    setVisible={setVisible}
                    setModalType={setModalType}
                />
            </div>
            <Table
                buttonData={{
                    onClick: handleTableButtonClick,
                    text: 'Добавить',
                }}
                handleEditClick={handleEditClick}
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteClick}
                tableData={generatedData}
                setTableData={setGeneratedData}
                paginatorData={{ offset: 25, countItems: count }}
                stopPropagation
            >
                <Column sortable header="номер" field="number" />
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Штрихкод" field="codeNumber" />
                <Column sortable header="Локация" field="location" />
            </Table>
            {modalType === 'more' && (
                <Modal>
                    <MoreInventoryModal
                        setData={setRowFormData}
                        data={rowFormData}
                        setLoading={setLoading}
                        total={total}
                    />
                </Modal>
            )}
            {modalType === 'one' && (
                <Modal>
                    <InventoryModal
                        setLoading={setLoading}
                        setInventoryData={setGeneratedData}
                        setSelectedImage={setSelectedItemImage as any}
                        selectedImage={selectedItemImage as []}
                        selectedItem={selectedItem}
                        type={type}
                    />
                </Modal>
            )}
            <NotificationToast>
                <ServiceChangeToast
                    count={modalType === 'one' ? 1 : total}
                    slug="Inventory"
                />
            </NotificationToast>
            {loading && <Spinner />}
        </>
    );
};
