'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { warningToastConfig } from 'config/toastConfig';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import {
    IModifiedPermissions,
    PermGroupTableWrapperProps,
} from 'app/(Main)/permission-group/types';
import { Modal } from 'components/Modal';
import { useModalStore } from 'store/modalVisibleStore';
import { PermModalForm } from 'app/(Main)/permission-group/components/PermModalForm';
import { usePathname } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { deleteGroupPerm } from 'http/permissionsApi';
import revalidate from 'utils/revalidate';

export const PermGroupTableWrapper: React.FC<PermGroupTableWrapperProps> = ({
    permissions,
    levels,
    allowedPermissions,
    count,
}) => {
    const path = usePathname();

    const [tableData, setTableData] =
        useState<IModifiedPermissions[]>(permissions);
    const [formType, setFormType] = useState<'create' | 'edit'>('create');
    const [selectedPerm, setSelectedPerm] = useState<IModifiedPermissions>();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTableData(permissions);
    }, [permissions]);

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
            toast('Это зарезервированное право', warningToastConfig);
            throw Error('Зарезерированно');
        }
    };

    return (
        <>
            <Table
                handleRowClick={
                    allowedPermissions.includes('PATCH')
                        ? handleRowClick
                        : undefined
                }
                handleEditClick={
                    allowedPermissions.includes('PATCH')
                        ? handleRowClick
                        : undefined
                }
                handleDeleteClick={
                    allowedPermissions.includes('DELETE')
                        ? handleDeleteButtonClick
                        : undefined
                }
                buttonData={
                    allowedPermissions.includes('POST')
                        ? {
                              onClick: handleButtonClick,
                              text: 'Добавить',
                          }
                        : undefined
                }
                paginatorData={{
                    offset: 15,
                    countItems: count,
                }}
                tableData={tableData}
                setTableData={setTableData}
            >
                <Column sortable header="Наименование" field="name" />
                <Column sortable header="Уровень прав" field="levelDesc" />
            </Table>
            <Modal>
                <PermModalForm
                    setTableData={setTableData}
                    formType={formType}
                    selectedPerm={selectedPerm}
                    level={levels}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
