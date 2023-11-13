'use client';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';
import { updateOrg } from 'http/organizationApi';
import { toast } from 'react-toastify';
import { successToastConfig } from 'config/toastConfig';

export const WorkersButton = () => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const handleRefreshClick = async () => {
        await updateOrg();
    };

    return (
        <>
            <Button onClick={() => setVisible(true)} type="button">
                Загрузить работников
            </Button>
            <Button onClick={() => handleRefreshClick()} type="button">
                Обновить данные
            </Button>
        </>
    );
};
