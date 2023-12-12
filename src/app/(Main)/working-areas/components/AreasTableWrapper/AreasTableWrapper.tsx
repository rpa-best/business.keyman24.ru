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
import revalidate from 'utils/revalidate';
import { usePriceBySlug } from 'hooks/usePrice';
import { toast } from 'react-toastify';
import { ToastPrice } from 'components/ToastPrice';
import { priceToastConfig, warningToastConfig } from 'config/toastConfig';
import { fetchLocationsAndTypes } from 'app/(Main)/working-areas/helpers/fetchLocationsAndTypes';
import { ILocation, IType } from 'http/types';
import { AxiosError } from 'axios';

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

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const price = usePriceBySlug('WorkingArea');

    const handleRowClick = (id: number) => {
        const slug = workingAreasData.find((area) => area.id === id);
        router.push(
            'working-areas/session/' + `${slug?.type.slug}-${slug?.id}`
        );
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
                    types={workingAreaTypes}
                />
            </Modal>
            {loading && <Spinner />}
        </>
    );
};
