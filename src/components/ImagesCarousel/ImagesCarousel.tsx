'use client';

import React, { useEffect, useState } from 'react';
import { ImageCarouselItem } from 'components/ImagesCarousel/ImageCarouselItem/ImageCarouselItem';

import { SpinnerFit } from 'components/Spinner/SpinnerFit';
import { ImageCarouselUpload } from 'components/ImagesCarousel/ImageCarouselUpload';
import { ImageCarouselProps, ImageType } from 'components/ImagesCarousel/types';
import { deletePhoto } from 'http/inventoryApi';

import scss from './ImageCarousel.module.scss';

export const ImagesCarousel: React.FC<ImageCarouselProps> = ({
    images,
    loading,
    setLoading,
    uploadSettings,
    deleteSettings,
}) => {
    const [carouselImages, setCarouselImages] = useState<ImageType[] | null>(
        images
    );

    useEffect(() => {
        setCarouselImages(images);
    }, [images]);

    const handleDeleteImageClick = async (id: number) => {
        if (deleteSettings?.url) {
            setLoading(true);
            await deletePhoto(deleteSettings?.url(id))
                .then(() => {
                    setCarouselImages(
                        (img) => img?.filter((image) => image.id !== id) as any
                    );
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <div className={scss.carousel_wrapper}>
            {uploadSettings?.url && (
                <ImageCarouselUpload
                    url={
                        typeof uploadSettings.url === 'function'
                            ? uploadSettings.url()
                            : uploadSettings.url
                    }
                    setLoading={setLoading}
                    setImages={setCarouselImages}
                />
            )}
            {carouselImages?.map((item, index) => {
                return (
                    <ImageCarouselItem
                        handleDelete={
                            deleteSettings ? handleDeleteImageClick : null
                        }
                        key={index}
                        item={item}
                    />
                );
            })}
            {loading && (
                <div className={scss.carousel_loading}>
                    <SpinnerFit />
                </div>
            )}
        </div>
    );
};
