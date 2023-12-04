'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { TableProps } from 'components/Table/types';
import { Spinner } from 'components/Spinner';
import { deleteLocation } from 'http/locationsApi';
import { Modal } from 'components/Modal';
import { LocationAction } from 'app/(Main)/locations/components/LocationsAction';
import { ILocation } from 'http/types';
import { useModalStore } from 'store/modalVisibleStore';
import { IOrganization } from 'store/types';
import revalidate from 'utils/revalidate';
import { toast } from 'react-toastify';
import { usePriceBySlug } from 'hooks/usePrice';
import { priceToastConfig, warningToastConfig } from 'config/toastConfig';
import { ToastPrice } from 'components/ToastPrice';
import { checkAccess } from 'utils/checkAccess';
import Cookies from 'universal-cookie';
import { AxiosError } from 'axios';

const cookie = new Cookies();

interface TableWrapperProps {
    tableRows: ILocation[];
    children: TableProps['children'];
    path?: string;
    organizations: IOrganization[];
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
    children,
    tableRows,
    path,
    organizations,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const pathName = usePathname();

    const [tableData, setTableData] = useState<ILocation[]>(tableRows);
    const [editableLocation, setEditableLocation] = useState<ILocation | null>(
        null
    );

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);

    const price = usePriceBySlug('Location');

    const handleAddClick = () => {
        setFormType('create');
        setEditableLocation(null);
        setVisible(true);
        toast(<ToastPrice price={price} />, priceToastConfig);
    };

    const handleEditClick = (id: number) => {
        setFormType('edit');
        setEditableLocation(tableData.find((el) => el.id === id) ?? null);
        setVisible(true);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        return deleteLocation(id)
            .then(() => revalidate(pathname))
            .finally(() => {
                setLoading(false);
            });
    };

    const handleRowClick = async (id: number) => {
        setLoading(true);
        const orgId = cookie.get('orgId');
        checkAccess(`business/${orgId}/location/${id}/object?deleted=false`)
            .then((d) => {
                if (d) {
                    router.prefetch(
                        `${pathName}/${id}${path ? '/' + path : ''}`
                    );
                    router.push(`${pathName}/${id}${path ? '/' + path : ''}`);
                } else {
                    toast('Недостаточно прав', warningToastConfig);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Table
                buttonData={{
                    onClick: () => handleAddClick(),
                    text: 'Добавить',
                }}
                handleDeleteClick={handleDeleteClick}
                handleEditClick={handleEditClick}
                handleRowClick={handleRowClick}
                setTableData={setTableData}
                tableData={tableData}
                prefetch={(id: number) =>
                    router.prefetch(
                        `${pathName}/${id}${path ? '/' + path : ''}`
                    )
                }
            >
                {children}
            </Table>
            <Modal>
                <LocationAction
                    setTableData={setTableData}
                    loading={loading}
                    organizations={organizations}
                    setLoading={setLoading}
                    location={editableLocation as ILocation}
                    formType={formType}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
