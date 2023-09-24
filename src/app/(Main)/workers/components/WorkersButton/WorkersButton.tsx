'use client';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';

export const WorkersButton = () => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    return (
        <Button onClick={() => setVisible(true)} type="button">
            Загрузить работников
        </Button>
    );
};
