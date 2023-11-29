'use client';

import { useEffect, useState } from 'react';
import { getInventoryImage } from 'http/inventoryApi';
import { useParams } from 'next/navigation';
import { IInventoryImage } from 'http/types';
import { ImagesCarousel } from 'components/ImagesCarousel';

export const ImageCarouselWrapper = () => {
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const inventoryId = params.id;

    const [images, setImages] = useState<IInventoryImage[] | null>(null);

    useEffect(() => {
        setLoading(true);
        getInventoryImage(+inventoryId)
            .then((d) => {
                setImages(d.results);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [inventoryId]);

    return <ImagesCarousel loading={loading} images={images} />;
};
