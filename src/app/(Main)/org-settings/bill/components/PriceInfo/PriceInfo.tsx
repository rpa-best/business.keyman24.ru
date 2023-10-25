'use client';

import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import { motion } from 'framer-motion';
import InfoSvg from 'app/(Main)/org-settings/bill/svg/info.svg';
import { onHide, onMount } from 'utils/TippyHelper';
import { useSpring } from 'framer-motion';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';
import Arrow from '/public/svg/arrow.svg';

export const PriceInfo = ({ price }: { price: number }) => {
    const opacity = useSpring(0);
    const [visible, setVisible] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                visible={visible}
                appendTo="parent"
                placement="top-end"
                offset={[-40, 15]}
                render={(attrs) => (
                    <motion.div
                        style={{ opacity }}
                        {...attrs}
                        className={scss.tippy}
                    >
                        <p className={scss.small_price}>
                            <span>{price}</span> ₽ / ед.
                        </p>
                    </motion.div>
                )}
            >
                <motion.span
                    style={{ width: 'max-content', height: 'max-content' }}
                    onHoverStart={() => setVisible(true)}
                    onHoverEnd={() => setVisible(false)}
                >
                    <InfoSvg className={scss.svg} />
                </motion.span>
            </Tippy>
        </div>
    );
};
