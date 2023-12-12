'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkAccess } from 'utils/checkAccess';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

import { Column } from 'components/Table/Column';
import { Table } from 'components/Table';
import { Modal } from 'components/Modal';
import { ObjectFormModal } from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/ObjectFromModal';
import { useModalStore } from 'store/modalVisibleStore';
import { IObject, PermissionsResponseType } from 'http/types';
import { deleteLocationObject } from 'http/locationsApi';
import { Spinner } from 'components/Spinner';
import revalidate from 'utils/revalidate';
import { usePriceBySlug } from 'hooks/usePrice';
import { ToastPrice } from 'components/ToastPrice';
import { priceToastConfig, warningToastConfig } from 'config/toastConfig';

const cookie = new Cookies();

interface ObjectsTableWrapper {
    modifiedObjects: IObject[];
    locId: number;
    permissions: PermissionsResponseType[];
    count: number;
}

export const ObjectsTableWrapper: React.FC<ObjectsTableWrapper> = ({
    modifiedObjects,
    locId,
    permissions,
    count,
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const [selectedObject, setSelectedObject] = useState<IObject>();
    const [tableRows, setTableRows] = useState(modifiedObjects);

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');

    const price = usePriceBySlug('ObjectInLocation');

    useEffect(() => {
        setTableRows(modifiedObjects);
    }, [modifiedObjects]);

    const handleRowClick = (id: number) => {
        const orgId = cookie.get('orgId');
        checkAccess(
            `business/${orgId}/inventory/?type=inventory&ordering=id`
        ).then((d) => {
            if (d) {
                revalidate(`${pathname}/${id}`);
                router.push(`${pathname}/${id}`);
            } else {
                toast('Недостаточно прав', warningToastConfig);
            }
        });
    };

    const handleAddClick = () => {
        setSelectedObject(undefined);
        setFormType('create');
        setVisible(true);
        toast(<ToastPrice price={price} />, priceToastConfig);
    };

    const handleEditClick = (id: number) => {
        setSelectedObject(
            modifiedObjects.find((obj) => obj.id === id) as IObject
        );
        setFormType('edit');
        setVisible(true);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        return deleteLocationObject(locId, id)
            .then(() => revalidate(pathname))
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Table
                buttonData={
                    permissions.includes('POST')
                        ? {
                              onClick: () => handleAddClick(),
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
                tableData={tableRows}
                setTableData={setTableRows}
                paginatorData={{
                    offset: 25,
                    countItems: count,
                }}
            >
                <Column header="Наименование" field="name" />
                <Column header="Описание" field="desc" />
            </Table>
            <Modal>
                <ObjectFormModal
                    setObjects={setTableRows}
                    object={selectedObject}
                    locId={locId}
                    type={formType}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
