import { IField } from 'store/useConstructorStore';
import { useEffect, useRef, useState } from 'react';
import { getPrice } from 'http/organizationApi';
import { IRate } from 'http/types';

type UsePriceType = (fields: IField[], delayMs: number) => number;

export const usePrice: UsePriceType = (fields, delayMs) => {
    const [price, setPrice] = useState<number>();
    const timerId = useRef<any>();

    useEffect(() => {
        const rateBody: IRate[] = fields.map((item) => {
            return {
                id: item.id,
                value: +item.count,
                key: item.slug,
                not_limited: item.notLimited,
            };
        });
        const fetchData = async () => {
            return await getPrice(rateBody);
        };

        timerId.current = setTimeout(() => {
            fetchData().then((d) => {
                setPrice(d.cost);
            });
        }, delayMs);

        return () => {
            clearTimeout(timerId.current);
        };
    }, [delayMs, fields]);

    return price as number;
};
