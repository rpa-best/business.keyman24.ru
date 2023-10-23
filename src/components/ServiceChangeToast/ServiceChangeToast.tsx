'use client';

import React, { memo, useEffect } from 'react';

import { useNotificationStore } from 'store/notificationStore';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';
import { usePriceBySlug } from 'hooks/usePrice';

import scss from './ServiceChangeToast.module.scss';

interface ServiceChangeToastProps {
    slug: string;
    count: number;
}

export const ServiceChangeToast = memo(function ServiceChangeToast({
    slug,
    count,
}: ServiceChangeToastProps) {
    const [setVisible] = useNotificationStore((state) => [state.setVisible]);

    const price = usePriceBySlug(slug);

    useEffect(() => {
        if (!count) {
            setVisible(false);
        }
    }, [count, setVisible]);

    return (
        <div className={scss.toast_wrapper}>
            <div className={scss.change_price}>
                Цена изменится на <span className={scss.bigger}>{price}</span>
            </div>
        </div>
    );
});
