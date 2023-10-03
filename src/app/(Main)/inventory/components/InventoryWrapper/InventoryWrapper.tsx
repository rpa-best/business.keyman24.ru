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
import {
    createInventoryKeys,
    deleteInventoryItem,
    getInventoryImage,
} from 'http/inventoryApi';
import { Button } from 'components/UI/Buttons/Button';
import { IData } from 'app/(Main)/locations/types';
import { IInventoryImage, LocKeyBody } from 'http/types';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';
import { ActionsButtons } from 'app/(Main)/inventory/components/ActionsButtons';
import { MoreInventoryModal } from 'app/(Main)/inventory/components/MoreInventoryModal';

export const InventoryWrapper: React.FC<InventoryWrapperProps> = ({
    inventory,
    count,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [modalType, setModalType] = useState<'one' | 'more'>('one');

    const [setNoteVisible] = useModalStore((state) => [state.setVisible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [selectedItem, setSelectedItem] = useState<IModifiedInventory>();
    const [type, setType] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);
    const [selectedItemImage, setSelectedItemImage] = useState<
        IInventoryImage[] | string[]
    >();
    const [generatedData, setGeneratedData] = useState<IModifiedInventory[]>(
        []
    );
    const [data, setData] = useState<IData[]>([]);

    const total = data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.count;
    }, 0);

    const lastId = useRef<number>();

    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        setGeneratedData(inventory);
    }, [inventory]);

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
        setModalType('one');
        setSelectedItem(undefined);
        setSelectedItemImage(undefined);
        setVisible(true);
        setNoteVisible(true);
    };

    return (
        <>
            <div className={scss.keys}>
                <div className={scss.key_generate_button}>
                    {inventory.length === 0 && (
                        <Button onClick={handleTableButtonClick} type="button">
                            Сгенерировать инвентарь
                        </Button>
                    )}
                </div>
                {generatedData.length !== 0 && (
                    <ActionsButtons
                        setVisible={setVisible}
                        setModalType={setModalType}
                    />
                )}
            </div>
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
                <Column sortable header="Локация" field="location" />
            </Table>
            {modalType === 'more' && (
                <Modal syncWithNote>
                    <MoreInventoryModal
                        setData={setData}
                        data={data}
                        setLoading={setLoading}
                        total={total}
                    />
                </Modal>
            )}
            {modalType === 'one' && (
                <Modal syncWithNote>
                    <InventoryModal
                        lastId={lastId.current as number}
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
