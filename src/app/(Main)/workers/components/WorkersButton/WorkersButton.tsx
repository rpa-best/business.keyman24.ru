'use client';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';
import { updateOrg } from 'http/organizationApi';
import FileSaver from 'file-saver';
import { getWorkersPlan } from 'http/workerApi';
import { useState } from 'react';
import { Spinner } from 'components/Spinner';

export const WorkersButton = () => {
    const [loading, setLoading] = useState(false);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const handleRefreshClick = async () => {
        await updateOrg();
    };
    const handleDownloadExcel = async () => {
        setLoading(true);
        await getWorkersPlan().then((d) => {
            FileSaver.saveAs(d, 'Учтёт времени');
            setLoading(false);
        });
    };

    return (
        <>
            <Button onClick={() => setVisible(true)} type="button">
                Загрузить работников
            </Button>
            <Button onClick={() => handleRefreshClick()} type="button">
                Обновить данные
            </Button>
            <Button onClick={() => handleDownloadExcel()} type="button">
                Учет времени
            </Button>
            {loading && <Spinner />}
        </>
    );
};
