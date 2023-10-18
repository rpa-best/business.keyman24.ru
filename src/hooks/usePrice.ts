import { IField } from 'store/useConstructorStore';
import { useEffect, useRef, useState } from 'react';
import { IRate } from 'http/types';
import { getPrice } from 'http/organizationApi';
import { useDebounce } from 'hooks/useDebounce';

type UsePriceType = (fields: IField[], delayMs: number) => number;

export const usePrice: UsePriceType = (fields, delayMs) => {
    const [price, setPrice] = useState<number>();

    const rateBody: IRate[] | null =
        fields[0] !== undefined
            ? fields.map((item) => {
                  return {
                      id: item.id,
                      value: +item.count,
                      key: item.slug,
                      not_limited: item.notLimited,
                  };
              })
            : null;

    useDebounce(async () => {
        rateBody !== null &&
            (await getPrice(rateBody).then((d) => {
                setPrice(d.cost);
            }));
    }, delayMs);

    return price as number;
};
