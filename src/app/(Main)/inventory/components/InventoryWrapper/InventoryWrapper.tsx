'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { IData } from 'app/(Main)/locations/types';
import { IInventoryImage } from 'http/types';

import { ActionsButtons } from 'app/(Main)/inventory/components/ActionsButtons';
import { MoreInventoryModal } from 'app/(Main)/inventory/components/MoreInventoryModal';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';
import { toast } from 'react-toastify';
import { ToastPrice } from 'components/ToastPrice';
import { usePriceBySlug } from 'hooks/usePrice';
import { priceToastConfig } from 'config/toastConfig';

export const InventoryWrapper: React.FC<InventoryWrapperProps> = ({
    inventory,
    count,
    permissions,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const path = usePathname();

    const [modalType, setModalType] = useState<'one' | 'more'>('one');
    const [type, setType] = useState<'create' | 'edit'>('create');

    const [visible] = useModalStore((state) => [state.visible]);
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

    const toastId = useRef<string | number | null>();

    const totalPositions = useMemo(() => {
        return rowFormData.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.count;
        }, 0);
    }, [rowFormData]);

    const priceByOne = usePriceBySlug('Inventory');

    const totalPrice = useMemo(() => {
        return totalPositions * priceByOne;
    }, [priceByOne, totalPositions]);

    useEffect(() => {
        if (totalPrice > 0 && modalType === 'more') {
            if (toastId.current) {
                toast.update(toastId.current, {
                    render: <ToastPrice price={totalPrice} />,
                });
            } else {
                toastId.current = toast.info(
                    <ToastPrice price={totalPrice} />,
                    {
                        position: 'top-right',
                        autoClose: false,
                    }
                );
            }
        } else if (totalPrice === 0 && modalType === 'more') {
            toast.dismiss();
            toastId.current = null;
        }
    }, [totalPrice, toastId.current, modalType]);

    useEffect(() => {
        if (!visible) {
            toastId.current = null;
        }
    }, [visible]);

    useEffect(() => {
        setGeneratedData(inventory);
    }, [inventory]);

    const handleEditClick = async (id: number) => {
        setLoading(true);
        setType('edit');
        setModalType('one');
        setVisible(true);
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
        toast(<ToastPrice price={priceByOne} />, priceToastConfig);
    };

    return (
        <>
            <div className={scss.keys}>
                <ActionsButtons
                    hasCreate={permissions.includes('POST')}
                    setVisible={setVisible}
                    setModalType={setModalType}
                />
            </div>
            <Table
                buttonData={
                    permissions.includes('POST')
                        ? {
                              onClick: handleTableButtonClick,
                              text: 'Добавить',
                          }
                        : undefined
                }
                handleEditClick={
                    permissions.includes('PATCH') ? handleEditClick : undefined
                }
                handleDeleteClick={
                    permissions.includes('DELETE')
                        ? handleDeleteClick
                        : undefined
                }
                handleRowClick={handleRowClick}
                tableData={generatedData}
                setTableData={setGeneratedData}
                paginatorData={{ offset: 25, countItems: count }}
                stopPropagation
            >
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Штрихкод" field="codeNumber" />
                <Column sortable header="Локация" field="location" />
                <Column sortable header="Статус инвентаря" field="statusName" />
            </Table>
            {modalType === 'more' && (
                <Modal>
                    <MoreInventoryModal
                        setData={setRowFormData}
                        data={rowFormData}
                        setLoading={setLoading}
                        total={totalPrice}
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
            {loading && <Spinner />}
        </>
    );
};
