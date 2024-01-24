'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { EditWorkingArea } from 'app/(Main)/working-areas/components/EditWorkingArea';
import { Spinner } from 'components/Spinner';
import { deleteWorkingArea } from 'http/workingAreaApi';

import {
    AreasTableWrapperProps,
    IModfiedWorkingArea,
} from 'app/(Main)/working-areas/types';
import revalidate from 'utils/revalidate';
import { usePriceBySlug } from 'hooks/usePrice';
import { ToastPrice } from 'components/ToastPrice';
import { priceToastConfig, warningToastConfig } from 'config/toastConfig';
import { fetchLocationsAndTypes } from 'app/(Main)/working-areas/helpers/fetchLocationsAndTypes';
import { ILocation, IType } from 'http/types';
import { checkAccess } from 'utils/checkAccess';

const cookies = new Cookies();

export const AreasTableWrapper: React.FC<AreasTableWrapperProps> = ({
    workingAreas,
    permissions,
    count,
}) => {
    const pathName = usePathname();
    const router = useRouter();

    const [workingAreasData, setWorkingAreasData] =
        useState<IModfiedWorkingArea[]>(workingAreas);
    const [editableArea, setEditableArea] = useState<IModfiedWorkingArea>();

    const [locationOrTypeDenied, setLocationOrTypeDenied] = useState(false);
    const [locations, setLocations] = useState<ILocation[]>([]);
    const [workingAreaTypes, setWorkingAreaTypes] = useState<IType[]>([]);

    const [formType, setFormType] = useState<'edit' | 'create'>('create');
    const [loading, setLoading] = useState(false);

    const [showDevices, setShowDevises] = useState(false);

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const price = usePriceBySlug('WorkingArea');

    const handleRowClick = (id: number) => {
        const orgId = cookies.get('orgId');
        checkAccess(
            `business/${orgId}/working_area/${id}/session/?ordering=-end_date`
        ).then((d) => {
            if (d) {
                const slug = workingAreasData.find((area) => area.id === id);
                router.push(
                    'working-areas/session/' + `${slug?.type.slug}-${slug?.id}`
                );
            } else {
                toast('Недостаточно прав');
            }
        });
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        return deleteWorkingArea(id)
            .then(() => revalidate(pathName))
            .finally(() => setLoading(false));
    };

    const handleEditClick = async (id: number) => {
        if (locationOrTypeDenied) {
            toast('Недостаточно прав', warningToastConfig);
            return;
        }
        setEditableArea(workingAreasData.find((area) => area.id === id));
        setFormType('edit');
        setVisible(true);
    };

    const handleAddClick = () => {
        if (locationOrTypeDenied) {
            toast('Недостаточно прав', warningToastConfig);
            return;
        }
        setFormType('create');
        setVisible(true);
        setEditableArea(undefined);
        toast(<ToastPrice price={price} />, priceToastConfig);
    };

    useEffect(() => {
        setWorkingAreasData(workingAreas);
    }, [workingAreas]);

    useEffect(() => {
        const orgId = cookies.get('orgId');
        fetchLocationsAndTypes()
            .then((d) => {
                setWorkingAreaTypes(d.workingAreaTypes.results);
                setLocations(d.locations.results);
            })
            .catch((e) => {
                if (e instanceof AxiosError) {
                    if (e.response?.status === 403) {
                        setLocationOrTypeDenied(true);
                    }
                }
            });
        checkAccess(`business/${orgId}/device/?place=working_area`).then(
            (d) => {
                setShowDevises(d as boolean);
            }
        );
    }, []);

    return (
        <>
            <Table
                buttonData={
                    permissions.includes('POST')
                        ? {
                              onClick: () => handleAddClick(),
                              text: 'Добавить',
                          }
                        : undefined
                }
                handleRowClick={handleRowClick}
                handleEditClick={
                    permissions.includes('PATCH') ? handleEditClick : undefined
                }
                handleDeleteClick={
                    permissions.includes('DELETE')
                        ? handleDeleteClick
                        : undefined
                }
                paginatorData={{
                    countItems: count,
                    offset: 15,
                }}
                tableData={workingAreasData}
                setTableData={setWorkingAreasData}
                prefetch={(id: number) => {
                    const slug = workingAreasData.find(
                        (area) => area.id === id
                    );
                    router.prefetch(
                        'working-areas/session/' + `${slug?.type.slug}-${id}`
                    );
                }}
            >
                <Column header="Наименование" field="name" />
                <Column sortable header="Локация" field="locationName" />
                <Column header="Тип" field="typeName" />
            </Table>
            <Modal>
                <EditWorkingArea
                    showDevices={showDevices}
                    setLoading={setLoading}
                    setWorkingAreasData={setWorkingAreasData}
                    editableArea={editableArea}
                    formType={formType}
                    locations={locations}
                    types={workingAreaTypes}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
