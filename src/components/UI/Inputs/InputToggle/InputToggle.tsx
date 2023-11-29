'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { InputToggleTypes } from 'components/UI/Inputs/InputToggle/InputToggle.types';

import scss from './InputToggle.module.scss';

const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
};

export const InputToggle: React.FC<InputToggleTypes> = ({
    label,
    value,
    onChange,
}) => {
    const toggleSwitch = () => {
        onChange(!value);
    };

    return (
        <div onClick={toggleSwitch} className={scss.toggle_wrapper}>
            <motion.div
                style={{ backgroundColor: value ? '#31D79B' : '#C5C5C5' }}
                className={scss.switch}
                data-ison={value}
            >
                <motion.div
                    className={scss.handle}
                    layout
                    transition={spring}
                />
            </motion.div>
            <label>{label}</label>
        </div>
    );
};
