'use client';

import React from 'react';

import { motion } from 'framer-motion';
import { circleAnimation } from 'app/(Authorization)/login/components/Circles/motionConfig';

import scss from './Circles.module.scss';

export const Circles = () => {
    return Array.from({ length: 4 }, (_, index) => index + 1).map((item) => (
        <motion.span
            initial="hidden"
            animate="visible"
            custom={item}
            variants={circleAnimation}
            className={scss.circle}
            key={item}
        />
    ));
};
