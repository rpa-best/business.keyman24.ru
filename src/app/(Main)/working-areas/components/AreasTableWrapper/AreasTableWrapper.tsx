'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { AreasTableWrapperProps } from 'app/(Main)/working-areas/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { EditWorkingArea } from 'app/(Main)/working-areas/components/EditWorkingArea';
import { deleteWorkingArea } from 'http/workingAreaApi';
import { Spinner } from 'components/Spinner';
import { IWorkingArea } from 'http/types';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';
import { useConstructorStore } from 'store/useConstructorStore';
import { subAction } from 'helpers/subAction';
import { useNotificationStore } from 'store/notificationStore';

export const AreasTableWrapper: React.FC<AreasTableWrapperProps> = ({
    workingAreas,
    workingTypes,
    initialAreas,
    locations,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);

    const [formType, setFormType] = useState<'edit' | 'create'>('create');
    const [editableArea, setEditableArea] = useState<IWorkingArea>();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRowClick = (id: number) => {
        const slug = initialAreas.find((area) => area.id === id);

        router.push(
            'working-areas/session/' + `${slug?.type.slug}-${slug?.id}`
        );
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        deleteWorkingArea(id)
            .then(() => {
                subAction(fields, 'WorkingArea', 1, 'del');
            })
            .finally(() => setLoading(false));
    };

    const handleEditClick = async (id: number) => {
        setEditableArea(initialAreas.find((area) => area.id === id));
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
                tableRows={workingAreas}
            >
                <Column header="Наименование" field="name" />
                <Column header="Локация" field="location" />
                <Column header="Тип" field="type" />
            </Table>
            <Modal>
                <EditWorkingArea
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
