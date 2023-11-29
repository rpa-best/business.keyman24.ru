import React, { useState } from 'react';
import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import { ImageCarouselItemFull } from 'components/ImagesCarousel/ImageCarouselItem/ImageCarouselItemFull';

import scss from 'components/ImagesCarousel/ImageCarousel.module.scss';

export const ImageCarouselItem: React.FC<ImageCarouselItemProps> = ({
    item,
}) => {
    const [fullView, setFullView] = useState(false);

    return (
        <>
            <div
                data-fullview={fullView}
                onClick={() => setFullView(!fullView)}
                className={scss.carousel_item}
            >
                <Image
                    className={scss.image}
                    src={`https://py.keyman24.ru${item.image}`}
                    fill
                    alt="изображение инвентаря"
                />
            </div>
            <AnimatePresence>
                {fullView && (
                    <ImageCarouselItemFull
                        setFullView={setFullView}
                        item={item}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
