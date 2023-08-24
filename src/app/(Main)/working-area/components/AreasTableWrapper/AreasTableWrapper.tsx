'use client';

import React from 'react';
import { AreasTableWrapperProps } from 'app/(Main)/working-area/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { EditWorkingArea } from 'app/(Main)/working-area/components/EditWorkingArea';

export const AreasTableWrapper: React.FC<AreasTableWrapperProps> = ({
    workingAreas,
    workingTypes,
    locations,
}) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    return (
        <>
            <Table
                buttonData={{
                    onClick: () => setVisible(true),
                    text: 'Добавить',
                }}
                tableRows={workingAreas}
            >
                <Column header="Наименование" field="name" />
                <Column header="Локация" field="location" />
                <Column header="Тип" field="type" />
            </Table>
            <Modal>
                <EditWorkingArea locations={locations} types={workingTypes} />
            </Modal>
        </>
    );
};
