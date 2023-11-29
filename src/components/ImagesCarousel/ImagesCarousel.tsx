'use client';

import React from 'react';
import { ImageCarouselItem } from 'components/ImagesCarousel/ImageCarouselItem/ImageCarouselItem';

import scss from './ImageCarousel.module.scss';
import { SpinnerFit } from 'components/Spinner/SpinnerFit';

export const ImagesCarousel: React.FC<ImageCarouselProps> = ({
    images,
    loading,
}) => {
    return (
        <div className={scss.carousel_wrapper}>
            {loading && (
                <div className={scss.carousel_loading}>
                    <SpinnerFit />
                </div>
            )}
            {images?.map((item, index) => {
                return <ImageCarouselItem key={index} item={item} />;
            })}
        </div>
    );
};
