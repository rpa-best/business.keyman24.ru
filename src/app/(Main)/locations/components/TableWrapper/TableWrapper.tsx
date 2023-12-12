'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Table } from 'components/Table';
import { Spinner } from 'components/Spinner';
import { deleteLocation } from 'http/locationsApi';
import { Modal } from 'components/Modal';
import { LocationAction } from 'app/(Main)/locations/components/LocationsAction';
import { ILocation } from 'http/types';
import { useModalStore } from 'store/modalVisibleStore';
import revalidate from 'utils/revalidate';
import { toast } from 'react-toastify';
import { usePriceBySlug } from 'hooks/usePrice';
import { priceToastConfig, warningToastConfig } from 'config/toastConfig';
import { ToastPrice } from 'components/ToastPrice';
import { checkAccess } from 'utils/checkAccess';
import Cookies from 'universal-cookie';
import { TableWrapperProps } from 'app/(Main)/locations/components/TableWrapper/types';
import { PermissionLocationType } from 'app/(Main)/locations/components/LocationsAction/types';

const cookie = new Cookies();

export const TableWrapper: React.FC<TableWrapperProps> = ({
    children,
    tableRows,
    path,
    organizations,
    allowedPermissions,
    count,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const pathName = usePathname();

    const [tableData, setTableData] = useState<ILocation[]>(tableRows);
    const [editableLocation, setEditableLocation] = useState<ILocation | null>(
        null
    );

    const [permissions, setPermissions] =
        useState<PermissionLocationType>(null);

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

    useEffect(() => {
        setTableData(tableRows);
    }, [tableRows]);

    useEffect(() => {
        const orgId = cookie.get('orgId');
        const locationId = tableRows[0].id;
        checkAccess(`business/${orgId}/location/${locationId}/org`).then(
            (d) => {
                setPermissions({
                    orgs: d,
                });
            }
        );
        checkAccess(`business/${orgId}/worker/`).then((d) => {
            if (d) {
                checkAccess(
                    `business/${orgId}/location/${locationId}/worker`
                ).then((d) => {
                    setPermissions({ ...permissions, workers: d });
                });
            }
        });
    }, []);

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
                    revalidate(`${pathName}/${id}${path ? '/' + path : ''}`);
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
                buttonData={
                    allowedPermissions.includes('POST')
                        ? {
                              onClick: () => handleAddClick(),
                              text: 'Добавить',
                          }
                        : undefined
                }
                handleDeleteClick={
                    allowedPermissions.includes('DELETE')
                        ? handleDeleteClick
                        : undefined
                }
                handleEditClick={
                    allowedPermissions.includes('PATCH')
                        ? handleEditClick
                        : undefined
                }
                paginatorData={{ offset: 15, countItems: count }}
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
                    permissions={permissions}
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
