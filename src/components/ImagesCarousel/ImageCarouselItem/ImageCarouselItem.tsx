import React, { useState } from 'react';
import Image from 'next/image';

import { AnimatePresence } from 'framer-motion';
import { ImageCarouselItemFull } from 'components/ImagesCarousel/ImageCarouselItem/ImageCarouselItemFull';
import DeleteSvg from '/public/svg/x.svg';
import { ImageCarouselItemProps } from 'components/ImagesCarousel/types';

import scss from 'components/ImagesCarousel/ImageCarousel.module.scss';

export const ImageCarouselItem: React.FC<ImageCarouselItemProps> = ({
    item,
    handleDelete,
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
                {handleDelete && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                        className={scss.delete_svg_wrapper}
                    >
                        <DeleteSvg className={scss.delete_svg} />
                    </div>
                )}
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
