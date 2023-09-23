'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { RangeSlider } from 'components/UI/Inputs/RangeSlider';
import { IRate, IServiceRate } from 'http/types';
import { useConstructorStore } from 'store/useConstructorStore';
import { usePrice } from 'helpers/usePrice';
import { Button } from 'components/UI/Buttons/Button';
import { useRouter } from 'next/navigation';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';
import { Spinner } from 'components/Spinner';
import { updateSub } from 'http/organizationApi';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';
import { toast } from 'react-toastify';

interface SubConstructorProps {
    subId: number;
    subs: IServiceRate[];
    currentPrice: number;
}

export const SubConstructor: React.FC<SubConstructorProps> = ({
    subId,
    subs,
    currentPrice,
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setFields] = useConstructorStore((state) => [state.setFields]);

    const price = usePrice(fields, 200);

    useEffect(() => {
        setFields(
            subs.map((item) => ({
                id: item.id,
                name: item.key.name,
                count: item.value.toString(),
                max: item.key.maxValue.toString(),
                slug: item.key.modelName,
                notLimited: item.notLimited,
            }))
        );
    }, [subs]);

    const handleInputChange = useCallback(
        (index: number, value: string) => {
            const updatedValues = [...fields];
            updatedValues[index].count = value;
            setFields(updatedValues);
        },
        [fields, setFields]
    );

    const handleSaveChanges = async () => {
        const rateBody: IRate[] = fields.map((item) => {
            return {
                id: item.id,
                value: +item.count,
                key: item.slug,
                not_limited: item.notLimited,
            };
        });
        setLoading(true);
        await updateSub(subId, rateBody)
            .then(() => {
                toast('Успешно', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'success',
                    theme: 'colored',
                });
            })
            .finally(() => {
                setLoading(false);
                router.refresh();
            });
    };

    return (
        <>
            <div className={scss.service_constructor}>
                {price &&
                    fields.map((item, index) => (
                        <div key={index} className={scss.range_wrapper}>
                            <RangeSlider
                                onChange={(count) =>
                                    handleInputChange(index, count)
                                }
                                key={index}
                                name={item.name}
                                value={item.count.toString()}
                                min="0"
                                fields={fields}
                                index={index}
                                setFields={setFields}
                                check={item.notLimited}
                                max={item.max}
                            />
                        </div>
                    ))}
            </div>
            <div className={scss.actions_wrapper}>
                <div className={scss.price_button}>
                    <Button onClick={handleSaveChanges} type="button">
                        Сохранить
                    </Button>
                </div>
                {price && (
                    <div className={scss.price_wrapper}>
                        <span className={scss.price}>{price} ₽</span> / месяц{' '}
                        <GetDifferencePrice
                            current={currentPrice}
                            newPrice={price}
                        />
                    </div>
                )}
            </div>
            {loading && <Spinner />}
        </>
    );
};