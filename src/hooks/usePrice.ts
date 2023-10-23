import { useEffect, useState } from 'react';

import { getPriceBySlug } from 'http/organizationApi';

type UsePriceType = (slug: string) => number;

export const usePriceBySlug: UsePriceType = (slug) => {
    const [price, setPrice] = useState<number>();

    useEffect(() => {
        const fetchData = async () => {
            return await getPriceBySlug(slug);
        };
        fetchData().then((d) => {
            setPrice(d.cost);
        });
    }, [slug]);

    return price as number;
};
