'use client';
import React, { useMemo } from 'react';

import clsx from 'clsx';
import scss from './GetDifferencePrice.module.scss';

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

    const difference = useMemo(() => {
        return current - newPrice === 0 ? null : Math.abs(current - newPrice);
    }, [current, newPrice]);

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
