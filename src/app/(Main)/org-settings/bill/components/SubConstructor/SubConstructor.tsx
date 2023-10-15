'use client';

import React, { useCallback, useState } from 'react';

import { RangeSlider } from 'components/UI/Inputs/RangeSlider';
import { IRate } from 'http/types';
import { useConstructorStore } from 'store/useConstructorStore';
import { usePrice } from 'hooks/usePrice';
import { Button } from 'components/UI/Buttons/Button';
import { GetDifferencePrice } from 'app/(Main)/org-settings/bill/components/GetDifferencePrice';
import { Spinner } from 'components/Spinner';
import { updateSub } from 'http/organizationApi';
import { toast } from 'react-toastify';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';
import { usePathname } from 'next/navigation';

interface SubConstructorProps {
    defaultPrice: number;
}

export const SubConstructor: React.FC<SubConstructorProps> = ({
    defaultPrice,
}) => {
    const [loading, setLoading] = useState(false);
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setFields] = useConstructorStore((state) => [state.setFields]);

    const price = usePrice(fields, 200);

    const path = usePathname();

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
        await updateSub(rateBody)
            .then(() => {
                revalidate(path);
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
            });
    };

    return (
        <>
            <div className={scss.service_constructor}>
                {fields.map((item, index) => (
                    <div key={index} className={scss.range_wrapper}>
                        <p className={scss.card_item}>
                            {item.name} : {item.count}
                        </p>
                        {/*  <RangeSlider
                            onChange={(count) =>
                                handleInputChange(index, count)
                            }
                            key={index}
                            name={item.name}
                            value={item.count.toString()}
                            min="0"
                            fields={fields}
                            index={index.toString()}
                            setFields={setFields}
                            check={item.notLimited}
                            max={item.max}
                        />*/}
                    </div>
                ))}
            </div>
            {/* <div className={scss.actions_wrapper}>
                <div className={scss.price_button}>
                    <Button onClick={handleSaveChanges} type="button">
                        Сохранить
                    </Button>
                </div>
                {
                    <div className={scss.price_wrapper}>
                        <span className={scss.price}>{defaultPrice} ₽</span> /
                        месяц{' '}
                        <GetDifferencePrice
                            current={defaultPrice}
                            newPrice={price}
                        />
                    </div>
                }
            </div>*/}
            {loading && <Spinner />}
        </>
    );
};
