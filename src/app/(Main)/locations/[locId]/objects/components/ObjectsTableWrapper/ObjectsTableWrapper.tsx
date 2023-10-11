'use client';

import React, { useState } from 'react';

import { Column } from 'components/Table/Column';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';
import { Modal } from 'components/Modal';
import { ObjectFormModal } from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/ObjectFromModal';
import { useModalStore } from 'store/modalVisibleStore';
import { IObject } from 'http/types';
import { deleteLocationObject } from 'http/locationsApi';
import { Spinner } from 'components/Spinner';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';
import revalidate from 'utils/revalidate';

interface ObjectsTableWrapper {
    modifiedObjects: IObject[];
    locId: number;
}

export const ObjectsTableWrapper: React.FC<ObjectsTableWrapper> = ({
    modifiedObjects,
    locId,
}) => {
    const [tableRows, setTableRows] = useState(modifiedObjects);

    const [loading, setLoading] = useState(false);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [selectedObject, setSelectedObject] = useState<IObject>();
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const router = useRouter();

    const pathname = usePathname();

    const handleRowClick = (id: number) => {
        router.push(`${pathname}/${id}`);
    };

    const handleAddClick = () => {
        setSelectedObject(undefined);
        setFormType('create');
        setVisible(true);
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
        deleteLocationObject(locId, id)
            .then(() => revalidate(pathname))
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Table
                handleEditClick={handleEditClick}
                buttonData={{
                    onClick: () => handleAddClick(),
                    text: 'Добавить',
                }}
                prefetch={(id) => router.prefetch(`${pathname}/${id}`)}
                handleDeleteClick={handleDeleteClick}
                handleRowClick={handleRowClick}
                tableData={tableRows}
                setTableData={setTableRows}
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
            <NotificationToast syncWithModal>
                <ServiceChangeToast count={1} slug="Object" />
            </NotificationToast>
            {loading && <Spinner />}
        </>
    );
};
