'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from 'components/UI/Buttons/Button';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { IData } from 'app/(Main)/locations/types';
import { RowForm } from 'app/(Main)/locations/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/locations/components/PreviewRowsList';
import { PdfGenerator } from 'app/(Main)/locations/components/PdfGenerator';
import { IInventory, LocKeyBody } from 'http/types';
import { Spinner } from 'components/Spinner';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';
import { createInventoryKeys, getClientInventories } from 'http/inventoryApi';
import { ServiceChangeToast } from 'components/ServiceChangeToast';
import { NotificationToast } from 'components/NotificationConfirm';

import scss from './InventoryKeys.module.scss';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';

interface KeysWrapperProps {
    count: number;
    inventories: IInventory[];
}

export const InventoryKeysWrapper: React.FC<KeysWrapperProps> = ({
    inventories,
    count,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IData[]>([]);
    const [fullData, setFullData] = useState<IInventory[]>([]);
    const [generatedData, setGeneratedData] = useState<IInventory[]>([]);

    useEffect(() => {
        setGeneratedData(inventories ?? []);
    }, [inventories]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getClientInventories();
            return res.results;
        };
        fetchData().then((d) => {
            setFullData(d);
        });
    }, []);

    const total = data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.count;
    }, 0);

    const router = useRouter();

    const handleTableButtonClick = () => {
        setVisible(true);
    };

    const handleDeleteOne = (id: string) => {
        setData(data.filter((d) => d.id !== id));
    };

    const handleGenerateClick = async () => {
        setLoading(true);
        const body: LocKeyBody[] = data.map((d) => {
            return { name: d.category, count: d.count };
        });

        createInventoryKeys(body)
            .then(() => {
                subAction(fields, 'Inventory', total, 'add');
                setData([]);
                router.refresh();
            })
            .finally(() => {
                setLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <div className={scss.keys}>
                {generatedData.length !== 0 && (
                    <>
                        <div className={scss.download_button_wrapper}>
                            <PDFDownloadLink
                                document={<PdfGenerator data={fullData} />}
                                fileName="Наклейки ШК"
                            >
                                <Button onClick={() => {}} type="button">
                                    Скачать наклейки ШК
                                </Button>
                            </PDFDownloadLink>
                        </div>
                        <div className={scss.keys_table_layout}>
                            <Table
                                buttonData={{
                                    text: 'Генерация инвентаря',
                                    onClick: () => handleTableButtonClick(),
                                }}
                                paginatorData={{
                                    offset: 25,
                                    countItems: count,
                                }}
                                rowClickable={false}
                                tableRows={generatedData}
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
                                deleteOne={handleDeleteOne}
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
