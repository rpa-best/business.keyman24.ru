'use client';

import React, { useEffect, useState } from 'react';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from 'components/UI/Buttons/Button';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { generateRandomITF14Code } from 'helpers/generateITF-14Code';
import { IData, IGeneratedKeys } from 'app/(Main)/locations/types';
import { RowForm } from 'app/(Main)/locations/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/locations/components/PreviewRowsList';
import { PdfGenerator } from 'app/(Main)/locations/components/PdfGenerator';

import scss from './KeysWrapper.module.scss';
import { createLocationKeys, deleteLocationKey } from 'http/locationsApi';
import { LocKeyBody, LocKeysResponse } from 'http/types';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { useModalStore } from 'store/modalVisibleStore';
import { Modal } from 'components/Modal';

interface KeysWrapperProps {
    keys: LocKeysResponse[];
}

export const KeysWrapper: React.FC<KeysWrapperProps> = ({ keys }) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<IData[]>([]);
    const [generatedData, setGeneratedData] = useState<LocKeysResponse[]>([]);

    const router = useRouter();

    const params = useParams();

    useEffect(() => {
        const countName: Record<string, number> = keys.reduce((acc, item) => {
            const { name } = item;
            // @ts-ignore
            acc[name] = (acc[name] ?? 0) + 1;
            return acc;
        }, {});

        const resultArray: IData[] = Object.keys(countName).map((name) => ({
            id: name,
            count: countName[name],
            category: name,
        }));

        setData(resultArray);
        setGeneratedData(keys ?? []);
    }, [keys]);

    const handleTableButtonClick = () => {
        setVisible(true);
    };

    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        await deleteLocationKey(+params.locId, +params.objId, +id).finally(
            () => {
                router.refresh();
            }
        );
        setLoading(false);
    };

    const handleGenerateClick = async () => {
        setLoading(true);
        const body: LocKeyBody[] = data.map((d) => {
            return { name: d.category, count: d.count };
        });

        createLocationKeys(+params.locId, +params.objId, body).finally(() => {
            router.refresh();
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
                                document={<PdfGenerator data={generatedData} />}
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
                                    text: 'Генерация ключей',
                                    onClick: () => handleTableButtonClick(),
                                }}
                                handleDeleteClick={handleDeleteClick}
                                rowClickable={false}
                                tableRows={generatedData.slice(0, 50) as any}
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
                <Modal>
                    <>
                        <h2 className={scss.actions_data_title}>
                            Генерация ключей
                        </h2>
                        <div className={scss.actions_wrapper}>
                            <RowForm setData={setData} />
                            <PreviewRowsList data={data} />
                        </div>
                        <div className={scss.button_wrapper}>
                            <Button
                                type="button"
                                onClick={() => handleGenerateClick()}
                            >
                                Сгенерировать ключи
                            </Button>
                        </div>
                    </>
                </Modal>
                {loading && <Spinner />}
            </div>
        </>
    );
};
