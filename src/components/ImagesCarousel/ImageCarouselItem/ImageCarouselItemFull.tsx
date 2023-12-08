import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import scss from 'components/ImagesCarousel/ImageCarousel.module.scss';
import { ImageCarouselItemFullProps } from 'components/ImagesCarousel/types';

export const ImageCarouselItemFull: React.FC<ImageCarouselItemFullProps> = ({
    item,
    setFullView,
}) => {
    return createPortal(
        <motion.div
            exit={{ backdropFilter: 'blur(0)' }}
            animate={{ backdropFilter: 'blur(10px)' }}
            onClick={() => setFullView(false)}
            className={scss.fullView_wrapper}
        >
            <motion.div
                exit={{ scale: 0, opacity: 0 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={scss.fullView_image_wrapper}
            >
                <Image
                    className={scss.fullView_image}
                    src={`https://py.keyman24.ru${item.image}`}
                    fill
                    alt="изображение инвентаря"
                />
            </motion.div>
        </motion.div>,
        document.body
    );
};
