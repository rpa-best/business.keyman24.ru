'use client';

import React, { useState } from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { PermGroupTableWrapperProps } from 'app/(Main)/permission-group/types';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { PermModalForm } from 'app/(Main)/permission-group/components/PermModalForm';
import { IGroupPermission } from 'http/types';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { deleteGroupPerm } from 'http/permissionsApi';
import { toast } from 'react-toastify';

export const PermGroupTableWrapper: React.FC<PermGroupTableWrapperProps> = ({
    permissions,
    initialPermissions,
    levels,
}) => {
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedPerm, setSelectedPerm] = useState<IGroupPermission>();
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const router = useRouter();

    const handleRowClick = (id: number) => {
        const selectedPerm = initialPermissions.find((p) => p.id === id);
        setSelectedPerm(selectedPerm);
        setFormType('edit');
        setVisible(true);
    };

    const handleButtonClick = () => {
        setFormType('create');
        setSelectedPerm(undefined);
        setVisible(true);
    };

    const handleDeleteButtonClick = async (id: number) => {
        const selectedPerm = initialPermissions.find((p) => p.id === id);
        if (selectedPerm?.org) {
            setLoading(true);
            await deleteGroupPerm(id).finally(() => {
                router.refresh();
                setLoading(false);
            });
        } else {
            toast('Это зарезервированное право', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'warning',
                theme: 'colored',
            });
        }
    };

    return (
        <>
            <Table
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteButtonClick}
                buttonData={{ onClick: handleButtonClick, text: 'Добавить' }}
                tableRows={permissions}
            >
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Уровень прав" field="level" />
            </Table>
            <Modal>
                <PermModalForm
                    formType={formType}
                    selectedPerm={selectedPerm}
                    level={levels}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
