'use client';

import React, { useState } from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import {
    IModifiedPermissions,
    PermGroupTableWrapperProps,
} from 'app/(Main)/permission-group/types';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { PermModalForm } from 'app/(Main)/permission-group/components/PermModalForm';
import { IGroupPermission } from 'http/types';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { deleteGroupPerm } from 'http/permissionsApi';
import { toast } from 'react-toastify';
import revalidate from 'utils/revalidate';

export const PermGroupTableWrapper: React.FC<PermGroupTableWrapperProps> = ({
    permissions,
    levels,
}) => {
    const path = usePathname();
    const [tableData, setTableData] =
        useState<IModifiedPermissions[]>(permissions);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedPerm, setSelectedPerm] = useState<IModifiedPermissions>();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const handleRowClick = (id: number) => {
        const selectedPerm = tableData.find((p) => p.id === id);
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
        const selectedPerm = tableData.find((p) => p.id === id);
        if (selectedPerm?.org) {
            setLoading(true);
            await deleteGroupPerm(id).finally(() => {
                setLoading(false);
                revalidate(path);
            });
        } else {
            toast('Это зарезервированное право', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'warning',
                theme: 'colored',
            });
            throw Error('Зарезерированно');
        }
    };

    return (
        <>
            <Table
                handleRowClick={handleRowClick}
                handleDeleteClick={handleDeleteButtonClick}
                buttonData={{ onClick: handleButtonClick, text: 'Добавить' }}
                tableData={tableData}
                setTableData={setTableData}
            >
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Уровень прав" field="levelDesc" />
            </Table>
            <Modal>
                <PermModalForm
                    setTableData={setTableData}
                    tableData={tableData}
                    formType={formType}
                    selectedPerm={selectedPerm}
                    level={levels}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
