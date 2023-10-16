'use client';
import React from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { useModalStore } from 'store/modalVisibleStore';

export const PaymentButton = () => {
    const [setModalVisible] = useModalStore((state) => [state.setVisible]);
    return (
        <div style={{ width: 'max-content' }}>
            <Button onClick={() => setModalVisible(true)} type="button">
                Пополнить
            </Button>
        </div>
    );
};
