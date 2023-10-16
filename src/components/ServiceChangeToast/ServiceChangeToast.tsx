'use client';

import React, { memo, useEffect } from 'react';
import { IField, useConstructorStore } from 'store/useConstructorStore';

import scss from './ServiceChangeToast.module.scss';
import { useNotificationStore } from 'store/notificationStore';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';

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

    console.log(fields);

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
            </div>
        </div>
    );
});
