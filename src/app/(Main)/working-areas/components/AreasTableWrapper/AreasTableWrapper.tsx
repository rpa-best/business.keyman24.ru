'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
    AreasTableWrapperProps,
    IModfiedWorkingArea,
} from 'app/(Main)/working-areas/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { EditWorkingArea } from 'app/(Main)/working-areas/components/EditWorkingArea';
import { deleteWorkingArea } from 'http/workingAreaApi';
import { Spinner } from 'components/Spinner';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';
import { useNotificationStore } from 'store/notificationStore';
import revalidate from 'utils/revalidate';

export const AreasTableWrapper: React.FC<AreasTableWrapperProps> = ({
    workingAreas,
    workingTypes,
    initialAreas,
    locations,
}) => {
    const pathName = usePathname();
    const router = useRouter();

    const [workingAreasData, setWorkingAreasData] =
        useState<IModfiedWorkingArea[]>(workingAreas);
    const [editableArea, setEditableArea] = useState<IModfiedWorkingArea>();

    const [formType, setFormType] = useState<'edit' | 'create'>('create');
    const [loading, setLoading] = useState(false);

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);

    useEffect(() => {
        setWorkingAreasData(workingAreas);
    }, [workingAreas]);

    const handleRowClick = (id: number) => {
        const slug = workingAreasData.find((area) => area.id === id);
        router.push(
            'working-areas/session/' + `${slug?.type.slug}-${slug?.id}`
        );
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        deleteWorkingArea(id)
            .then(() => revalidate(pathName))
            .finally(() => setLoading(false));
    };

    const handleEditClick = async (id: number) => {
        setEditableArea(workingAreasData.find((area) => area.id === id));
        setFormType('edit');
        setVisible(true);
    };

    return (
        <>
            <Table
                buttonData={{
                    onClick: () => {
                        setFormType('create');
                        setVisible(true);
                        setNoteVisible(true);
                        setEditableArea(undefined);
                    },
                    text: 'Добавить',
                }}
                handleRowClick={handleRowClick}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                tableData={workingAreasData}
                setTableData={setWorkingAreasData}
                prefetch={(id: number) => {
                    const slug = initialAreas.find((area) => area.id === id);
                    router.prefetch(
                        'working-areas/session/' + `${slug?.type.slug}-${id}`
                    );
                }}
            >
                <Column header="Наименование" field="name" />
                <Column header="Локация" field="locationName" />
                <Column header="Тип" field="typeName" />
            </Table>
            <Modal>
                <EditWorkingArea
                    setLoading={setLoading}
                    setWorkingAreasData={setWorkingAreasData}
                    editableArea={editableArea}
                    formType={formType}
                    locations={locations}
                    types={workingTypes}
                />
            </Modal>
            <NotificationToast syncWithModal>
                <ServiceChangeToast count={1} slug="WorkingArea" />
            </NotificationToast>
            {loading && <Spinner />}
        </>
    );
};
