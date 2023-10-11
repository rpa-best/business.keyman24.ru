'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';
import { TableProps } from 'components/Table/types';
import { Spinner } from 'components/Spinner';
import { deleteLocation } from 'http/locationsApi';

import { useConstructorStore } from 'store/useConstructorStore';
import { subAction } from 'helpers/subAction';
import { EditWorkingArea } from 'app/(Main)/working-areas/components/EditWorkingArea';
import { Modal } from 'components/Modal';
import { LocationAction } from 'app/(Main)/locations/components/LocationsAction';
import { ILocation } from 'http/types';
import { useModalStore } from 'store/modalVisibleStore';
import { IOrganization } from 'store/types';
import { NotificationToast } from 'components/NotificationConfirm';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import revalidate from 'utils/revalidate';

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

    const [tableData, setTableData] = useState<ILocation[]>(tableRows);

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [editableLocation, setEditableLocation] = useState<ILocation | null>(
        null
    );
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const pathName = usePathname();

    const handleAddClick = () => {
        setFormType('create');
        setEditableLocation(null);
        setVisible(true);
    };

    const handleEditClick = (id: number) => {
        setFormType('edit');
        setEditableLocation(tableData.find((el) => el.id === id) ?? null);
        setVisible(true);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        deleteLocation(id)
            .then(() => revalidate(pathname))
            .finally(() => {
                setLoading(false);
            });
    };

    const handleRowClick = (id: number) => {
        router.push(`${pathName}/${id}${path ? '/' + path : ''}`);
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
            <NotificationToast syncWithModal>
                <ServiceChangeToast count={1} slug="Location" />
            </NotificationToast>
            {loading && <Spinner />}
        </>
    );
};
