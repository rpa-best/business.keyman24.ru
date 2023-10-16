'use client';

import React from 'react';

import { useConstructorStore } from 'store/useConstructorStore';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';

export const SubConstructor = () => {
    const [fields] = useConstructorStore((state) => [state.fields]);

    return (
        <>
            <div className={scss.service_constructor}>
                {fields.map((item, index) => (
                    <div key={index} className={scss.range_wrapper}>
                        <p className={scss.card_item}>
                            {item.name} : {item.count}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};
