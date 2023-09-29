import { IField } from 'store/useConstructorStore';
import { useEffect, useRef, useState } from 'react';
import { IRate } from 'http/types';
import { getPrice } from 'http/organizationApi';

type UsePriceType = (fields: IField[], delayMs: number) => number;

export const usePrice: UsePriceType = (fields, delayMs) => {
    const [price, setPrice] = useState<number>();
    const timerId = useRef<any>();

    useEffect(() => {
        if (fields[0] !== undefined) {
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
        }

        return () => {
            clearTimeout(timerId.current);
        };
    }, [delayMs, fields]);

    return price as number;
};
