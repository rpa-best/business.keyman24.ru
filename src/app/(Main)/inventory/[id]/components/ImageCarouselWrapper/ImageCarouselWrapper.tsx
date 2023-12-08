'use client';

import { useEffect, useState } from 'react';
import { getInventoryImage } from 'http/inventoryApi';
import { useParams } from 'next/navigation';
import { IInventoryImage } from 'http/types';
import { ImagesCarousel } from 'components/ImagesCarousel';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

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

    return (
        <ImagesCarousel
            deleteSettings={{
                url: (imageId) => {
                    const orgId = cookie.get('orgId');
                    return `business/${orgId}/inventory/${inventoryId}/image/${imageId}`;
                },
            }}
            uploadSettings={{
                url: () => {
                    const orgId = cookie.get('orgId');
                    return `business/${orgId}/inventory/${inventoryId}/image/`;
                },
            }}
            setLoading={setLoading}
            loading={loading}
            images={images}
        />
    );
};
