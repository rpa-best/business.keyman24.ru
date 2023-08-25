'use client';

import { useEffect, useState } from 'react';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from 'components/UI/Buttons/Button';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { generateRandomITF14Code } from 'helpers/generateITF-14Code';
import { RowForm } from 'app/(Main)/keys/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/keys/components/PreviewRowsList';
import { IData, IGeneratedKeys } from 'app/(Main)/keys/types';
import { PdfGenerator } from 'app/(Main)/keys/components/PdfGenerator';

import scss from './KeysWrapper.module.scss';

export const KeysWrapper = () => {
    const [data, setData] = useState<IData[]>([]);
    const [generatedData, setGeneratedData] = useState<IGeneratedKeys[]>([]);

    useEffect(() => {
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
    }, []);

    const handleDeleteOne = (id: string) => {
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
    };

    const handleDeleteAll = () => {
        setData([]);
        localStorage.removeItem('data');
    };

    const handleChangeItem = (id: string, field: string, value: string) => {
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
    };

    const handleGenerateClick = async () => {
        const arr: IGeneratedKeys[] = [];
        data.forEach((item) => {
            for (let i = 1; i <= +item.count; i++) {
                const newItem = {
                    id: i.toString(),
                    code: generateRandomITF14Code(),
                    category: item.category,
                };
                const isDuplicate = generatedData.some(
                    (existingItem) =>
                        existingItem.id === newItem.id &&
                        existingItem.category === newItem.category
                );

                if (!isDuplicate) {
                    arr.push(newItem);
                }
            }
        });
        setGeneratedData((data) => [...data, ...arr]);
    };

    return (
        <>
            <div className={scss.keys}>
                <div className={scss.actions_wrapper}>
                    <RowForm setData={setData} />
                    <PreviewRowsList
                        handleChange={handleChangeItem}
                        deleteAll={handleDeleteAll}
                        deleteOne={handleDeleteOne}
                        data={data}
                    />
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
                                rowClickable={false}
                                tableRows={generatedData.slice(0, 50) as any}
                            >
                                <Column header="id" field="id" />
                                <Column
                                    header="Название"
                                    field="category"
                                    sortable
                                />
                                <Column header="Код" field="code" />
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
