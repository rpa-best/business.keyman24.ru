'use client';

import React, { memo, useEffect, useRef, useState } from 'react';
import { usePrice } from 'helpers/usePrice';
import { IField, useConstructorStore } from 'store/useConstructorStore';

import scss from './ServiceChangeToast.module.scss';
import { useNotificationStore } from 'store/notificationStore';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';
import { IRate } from 'http/types';
import { updateSub } from 'http/organizationApi';
import { toast } from 'react-toastify';

interface ServiceChangeToastProps {
    slug: string;
    count: number;
}

export const ServiceChangeToast = memo(function ServiceChangeToast({
    slug,
    count,
}: ServiceChangeToastProps) {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [currentPrice] = useConstructorStore((state) => [state.currentPrice]);
    const [setVisible] = useNotificationStore((state) => [state.setVisible]);

    const field = fields.find((el) => {
        return el.slug === slug;
    });

    const price = field?.notLimited
        ? field.costNotLimited
        : count * (field as IField).cost;

    useEffect(() => {
        if (!count) {
            setVisible(false);
        }
        if (field) {
            if (field.notLimited) {
                setVisible(false);
            }
        }
    }, [count, field, setVisible]);

    return (
        <div className={scss.toast_wrapper}>
            <div className={scss.change_price}>
                Цена изменится на:{' '}
                <GetDifferencePrice current={currentPrice} newPrice={price} />
                {/* <div className={scss.buttons_wrapper}>
                    <button onClick={handleConfirm} className={scss.yes_button}>
                        Да
                    </button>
                    <button
                        onClick={() => {
                            setVisible(false);
                        }}
                        className={scss.no_button}
                    >
                        Нет
                    </button>
                </div>*/}
            </div>
        </div>
    );
});
