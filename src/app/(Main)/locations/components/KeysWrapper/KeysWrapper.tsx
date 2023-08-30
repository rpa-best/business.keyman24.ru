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

interface KeysWrapperProps {
    keys: LocKeysResponse[];
}

export const KeysWrapper: React.FC<KeysWrapperProps> = ({ keys }) => {
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

    /*useEffect(() => {
        const localData = localStorage.getItem('data') as string;
        const parsedData: IData[] = JSON.parse(localData) ?? [];

        const arr: IGeneratedKeys[] = [];
        parsedData.forEach((item) => {
            for (let i = 1; i <= +item.count; i++) {
                arr.push({
                    id: i.toString(),
                    code: generateRandomITF14Code(),
                    category: item.category,
                });
            }
        });
        setData(parsedData);
        setGeneratedData(arr);
    }, []);*/

    /*    const handleDeleteOne = (id: string) => {
        const dataItem = data.find((dat) => dat.id === id);
        setData(data?.filter((d) => d.id !== id));
        setGeneratedData(
            generatedData.filter((d) => d.category !== dataItem?.category)
        );
        const localData: IData[] = JSON.parse(
            localStorage.getItem('data') as string
        );
        const newLocalData = localData.filter(
            (l) => l.category !== dataItem?.category
        );
        localStorage.setItem('data', JSON.stringify(newLocalData));
    };*/

    /*    const handleDeleteAll = () => {
        setData([]);
        localStorage.removeItem('data');
    };*/

    /*    const handleChangeItem = (id: string, field: string, value: string) => {
        setData((prevValue) => {
            if (!prevValue) {
                return prevValue;
            }

            return prevValue.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            });
        });
    };*/

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
        });
    };

    return (
        <>
            <div className={scss.keys}>
                <div className={scss.actions_wrapper}>
                    <RowForm setData={setData} />
                    <PreviewRowsList data={data} />
                </div>
                <div className={scss.button_layout}>
                    <div className={scss.button_wrapper}>
                        <Button
                            type="button"
                            onClick={() => handleGenerateClick()}
                        >
                            Сгенерировать ключи
                        </Button>
                    </div>
                </div>
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
                {loading && <Spinner />}
            </div>
        </>
    );
};
