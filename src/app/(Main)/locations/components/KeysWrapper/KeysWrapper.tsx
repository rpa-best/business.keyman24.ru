'use client';

import React, { useEffect, useState } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { IData } from 'app/(Main)/locations/types';
import { RowForm } from 'app/(Main)/locations/components/RowForm';
import { PreviewRowsList } from 'app/(Main)/locations/components/PreviewRowsList';
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
import revalidate from 'utils/revalidate';

import scss from './KeysWrapper.module.scss';
import { NameInputSelect } from 'app/(Main)/components/NameInputSelect';

interface KeysWrapperProps {
    count: number;
    keys: LocKeysResponse[];
}

export const KeysWrapper: React.FC<KeysWrapperProps> = ({ keys, count }) => {
    const pathname = usePathname();
    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const [previewKeys, setPreviewKeys] = useState<IData[]>([]);
    const [generatedKeys, setGeneratedKeys] = useState<LocKeysResponse[]>([]);

    const total = previewKeys.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.count;
    }, 0);

    useEffect(() => {
        setGeneratedKeys(keys);
    }, [keys]);

    const handleTableButtonClick = () => {
        setVisible(true);
    };

    const handleDeleteOneData = (id: string) => {
        setPreviewKeys((d) => d.filter((dat) => dat.id !== id));
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
        const body: LocKeyBody[] = previewKeys.map((d) => {
            return { name: d.category, count: d.count };
        });
        createLocationKeys(+params.locId, +params.objId, body)
            .then(() => {
                setPreviewKeys([]);
            })
            .finally(() => {
                revalidate(pathName);
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
                <>
                    <div className={scss.actions_buttons_wrapper}>
                        <div className={scss.action_button_solo}>
                            <div className={scss.download_button}>
                                <Button onClick={() => {}} type="button">
                                    Скачать наклейки ШК
                                </Button>
                            </div>
                            <div className={scss.filter_input}>
                                <NameInputSelect type="key" />
                            </div>
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
                            tableData={generatedKeys}
                            setTableData={setGeneratedKeys}
                            stopPropagation
                        >
                            <Column header="Название" field="name" sortable />
                            <Column header="Код" field="codeNumber" />
                        </Table>
                    </div>
                </>

                <Modal syncWithNote>
                    <>
                        <h2 className={scss.actions_data_title}>
                            Генерация ключей
                        </h2>
                        <div className={scss.actions_wrapper}>
                            <RowForm setData={setPreviewKeys} />
                            <PreviewRowsList
                                deleteOne={handleDeleteOneData}
                                data={previewKeys}
                            />
                        </div>
                        <div className={scss.button_wrapper}>
                            <Button
                                disabled={previewKeys.length === 0}
                                type="button"
                                onClick={() => handleGenerateClick()}
                            >
                                Сгенерировать инвентарь
                            </Button>
                        </div>
                    </>
                </Modal>
                <NotificationToast>
                    <ServiceChangeToast count={total} slug="Key" />
                </NotificationToast>
                {loading && <Spinner />}
            </div>
        </>
    );
};
