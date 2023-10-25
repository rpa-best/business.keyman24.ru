'use client';

import React from 'react';

import { useConstructorStore } from 'store/useConstructorStore';
import { PriceInfo } from 'app/(Main)/org-settings/bill/components/PriceInfo';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';

export const SubConstructor = () => {
    const [fields] = useConstructorStore((state) => [state.fields]);

    return (
        <>
            <div className={scss.service_constructor}>
                {fields.map((item, index) => (
                    <div key={index} className={scss.range_wrapper}>
                        <div className={scss.card_item}>
                            {item.name} : {item.count}{' '}
                            <PriceInfo price={item.cost} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
