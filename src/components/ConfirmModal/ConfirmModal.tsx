'use client';

import React, { FC } from 'react';

import scss from './ConfirmModal.module.scss';
import { ConfirmModalProps } from 'components/ConfirmModal/types';
import { toast } from 'react-toastify';

export const ConfirmModal: FC<ConfirmModalProps> = ({
    onConfirm,
    text,
    catchErrors,
    afterConfirm,
}) => {
    const handleConfirmClick = async () => {
        try {
            const res = await onConfirm();
            afterConfirm(res);
            toast.dismiss();
        } catch (e) {
            catchErrors(e);
        }
    };

    const handleRejectClick = () => {
        toast.dismiss();
    };

    return (
        <div className={scss.modal}>
            <h3 className={scss.modal_text}>{text}</h3>
            <div className={scss.buttons_wrapper}>
                <button
                    onClick={handleConfirmClick}
                    className={scss.yes_button}
                >
                    Да
                </button>
                <button onClick={handleRejectClick} className={scss.no_button}>
                    Нет
                </button>
            </div>
        </div>
    );
};
