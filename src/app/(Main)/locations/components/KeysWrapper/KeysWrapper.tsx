'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from 'components/UI/Buttons/Button';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { IData } from 'app/(Main)/locations/types';
import { RowForm } from 'app/(Main)/locations/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/locations/components/PreviewRowsList';
import { PdfGenerator } from 'app/(Main)/locations/components/PdfGenerator';
import {
    createLocationKeys,
    deleteLocationKey,
    getLocationClientKeys,
} from 'http/locationsApi';
import { LocKeyBody, LocKeysResponse } from 'http/types';
import { Spinner } from 'components/Spinner';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';
import { subAction } from 'helpers/subAction';

import scss from './KeysWrapper.module.scss';
import { fetchData } from 'app/(Main)/permission-group/components/PermModalForm/fetchData';
import revalidate from 'utils/revalidate';

interface KeysWrapperProps {
    count: number;
    keys: LocKeysResponse[];
}

export const KeysWrapper: React.FC<KeysWrapperProps> = ({ keys, count }) => {
    const pathname = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IData[]>([]);
    const [generatedData, setGeneratedData] = useState<LocKeysResponse[]>([]);

    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();

    useEffect(() => {
        setGeneratedData(keys);
    }, [keys]);

    const total = data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.count;
    }, 0);

    const handleTableButtonClick = () => {
        setVisible(true);
    };

    const handleDeleteOneData = (id: string) => {
        setData((d) => d.filter((dat) => dat.id !== id));
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteLocationKey(+params.locId, +params.objId, +id)
            .then(() => revalidate(pathname))
            .finally(() => {
                setLoading(false);
            });
    };

    const handleGenerateClick = async () => {
        setLoading(true);
        const body: LocKeyBody[] = data.map((d) => {
            return { name: d.category, count: d.count };
        });

        createLocationKeys(+params.locId, +params.objId, body)
            .then((d) => {
                revalidate(pathName);
                setData([]);
            })
            .finally(() => {
                setLoading(false);
                setVisible(false);
            });
    };

    const handleRowClick = (id: number) => {
        router.push(`${pathName}/history/${id}`);
    };

    return (
        <>
            <div className={scss.keys}>
                <div className={scss.key_generate_button}>
                    {keys.length === 0 && (
                        <Button onClick={handleTableButtonClick} type="button">
                            Сгенерировать ключи
                        </Button>
                    )}
                </div>
                {generatedData.length !== 0 && (
                    <>
                        <div className={scss.actions_buttons_wrapper}>
                            <div className={scss.action_button_solo}>
                                <Button onClick={() => {}} type="button">
                                    Скачать наклейки ШК
                                </Button>
                            </div>
                        </div>
                        <div className={scss.keys_table_layout}>
                            <Table
                                buttonData={{
                                    text: 'Генерация ключей',
                                    onClick: () => handleTableButtonClick(),
                                }}
                                paginatorData={{
                                    offset: 25,
                                    countItems: count,
                                }}
                                handleRowClick={handleRowClick}
                                handleDeleteClick={handleDeleteClick}
                                tableData={generatedData}
                                setTableData={setGeneratedData}
                                stopPropagation
                            >
                                <Column
                                    header="Название"
                                    field="name"
                                    sortable
                                />
                                <Column header="Код" field="codeNumber" />
                            </Table>
                        </div>
                    </>
                )}
                <Modal syncWithNote>
                    <>
                        <h2 className={scss.actions_data_title}>
                            Генерация ключей
                        </h2>
                        <div className={scss.actions_wrapper}>
                            <RowForm setData={setData} />
                            <PreviewRowsList
                                deleteOne={handleDeleteOneData}
                                data={data}
                            />
                        </div>
                        <div className={scss.button_wrapper}>
                            <Button
                                disabled={data.length === 0}
                                type="button"
                                onClick={() => handleGenerateClick()}
                            >
                                Сгенерировать инвентарь
                            </Button>
                        </div>
                    </>
                </Modal>
                <NotificationToast>
                    <ServiceChangeToast count={total} slug="Inventory" />
                </NotificationToast>
                {loading && <Spinner />}
            </div>
        </>
    );
};
