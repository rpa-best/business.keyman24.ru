'use client';

import { RangeSlider } from 'components/UI/Inputs/RangeSlider';
import React, { useEffect, useRef } from 'react';
import { usePrice } from 'helpers/usePrice';
import { useConstructorStore } from 'store/useConstructorStore';

import scss from './ServiceChangeToast.module.scss';
import { useNotificationStore } from 'store/notificationStore';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';
import { IRate } from 'http/types';
import { updateSub } from 'http/organizationApi';
import { toast } from 'react-toastify';

interface ServiceChangeToastProps {
    slug: string;
    count: number;
    onConfirm: () => void;
}

export const ServiceChangeToast: React.FC<ServiceChangeToastProps> = ({
    slug,
    count,
    onConfirm,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setFields] = useConstructorStore((state) => [state.setFields]);
    const [setVisible] = useNotificationStore((state) => [state.setVisible]);
    const [currentPrice] = useConstructorStore((state) => [state.currentPrice]);
    const price = usePrice(fields, 200);

    const fieldIndex = fields.findIndex((el) => {
        return el.slug === slug;
    });

    const field = fields[fieldIndex];

    const handleConfirm = () => {
        onConfirm();
        setVisible(false);
        field.count = (+field.count + count).toString();
        const newFields = fields.filter((fld) => fld.id !== field.id);

        setFields([...newFields, field]);

        const rateBody: IRate[] = fields.map((item) => {
            return {
                id: item.id,
                value: +item.count,
                key: item.slug,
                not_limited: item.notLimited,
            };
        });
        updateSub(rateBody).catch(() => {
            toast('Ошибка в обновлении подписки', {
                position: 'bottom-right',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'error',
                theme: 'colored',
            });
        });
    };

    useEffect(() => {
        if (field.notLimited) {
            setVisible(false);
        }
    }, [field.notLimited, setVisible]);

    return (
        <div className={scss.toast_wrapper}>
            <div className={scss.change_price}>
                Цена изменится на:{' '}
                <GetDifferencePrice current={currentPrice} newPrice={price} />
                <div className={scss.buttons_wrapper}>
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
                </div>
            </div>
        </div>
    );
};
