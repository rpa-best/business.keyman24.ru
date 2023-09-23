'use client';
import React from 'react';

import scss from './GetDifferencePrice.module.scss';
import clsx from 'clsx';

interface GetDifferencePriceProps {
    current: number;
    newPrice: number;
}

export const GetDifferencePrice: React.FC<GetDifferencePriceProps> = ({
    current,
    newPrice,
}) => {
    const bigger = newPrice > current ? '+' : null;
    const smaller = newPrice < current ? '-' : null;

    const difference =
        current - newPrice === 0 ? null : Math.abs(current - newPrice);

    const pClass = clsx({
        [scss.bigger]: bigger,
        [scss.smaller]: smaller,
    });

    if (!newPrice) {
        return null;
    }

    return (
        <p className={pClass}>
            {bigger} {smaller} {difference}
        </p>
    );
};
