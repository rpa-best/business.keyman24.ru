'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import { IRangeInputProps } from 'components/UI/Inputs/types';
import { InputCheckbox } from 'components/UI/Inputs/InputCheckbox/InputCheckbox';

import scss from './RangeSlider.module.scss';

export const RangeSlider: React.FC<IRangeInputProps> = ({
    min,
    name,
    value,
    max,
    theme = 'dark',
    onChange,
    check,
    fields,
    index,
    setFields,
}) => {
    const [checked, setChecked] = useState(check);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const progress = (+e.target.value / +max) * 100;
        onChange(e.target.value);
        if (inputRef.current) {
            inputRef.current.style.backgroundImage = `linear-gradient(to right, #31D79B ${progress}%, #ccc ${progress}%)`;
        }
    };

    const handleCheckBox = (check: boolean) => {
        setChecked(check);
        if (fields && setFields && index) {
            const updatedValues = [...fields];
            updatedValues[+index].notLimited = check;
            setFields(updatedValues);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value > max) {
            let value = +e.target.value;
            while (value > +max) {
                value = value / 10;
            }

            onChange(value.toString());
        }
    };

    useEffect(() => {
        const progress = (+value / +max) * 100;
        if (inputRef.current) {
            inputRef.current.style.backgroundImage = `linear-gradient(to right, #31D79B ${progress}%, #ccc ${progress}%)`;
        }
    }, [max, value, checked]);

    const titleClass = clsx({
        [scss.input_title]: theme === 'dark',
        [scss.input_title_light]: theme === 'light',
    });

    const inputClass = clsx({
        [scss.input]: theme === 'dark',
        [scss.input_light]: theme === 'light',
    });

    return (
        <div className={scss.range_wrapper}>
            <motion.div
                initial={{ height: checked ? '40px' : '60px' }}
                animate={{ height: checked ? '40px' : '60px' }}
                className={scss.input_range_wrapper}
            >
                <div className={scss.input_range_wrapper}>
                    <div className={scss.input_range_title}>
                        <p className={titleClass}>{name}</p>
                        <InputCheckbox
                            theme={theme}
                            name="limited"
                            label="Безлимит"
                            value={checked}
                            type="checkbox"
                            onChange={handleCheckBox}
                        />
                    </div>
                    <AnimatePresence mode="wait">
                        {!checked && (
                            <motion.div
                                initial={{ opacity: 1, height: '50px' }}
                                animate={{ opacity: 1, height: '50px' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={scss.inputs_wrapper}
                            >
                                <div className={scss.input_range_wrapper}>
                                    {min && <p className={scss.min}>{min}</p>}
                                    <input
                                        ref={inputRef}
                                        className={scss.input_range}
                                        value={value}
                                        min={min}
                                        max={max}
                                        onChange={handleInputChange}
                                        type="range"
                                    />
                                    {max && <p className={scss.max}>{max}</p>}
                                </div>
                                <input
                                    className={inputClass}
                                    value={value}
                                    type="number"
                                    onBlur={handleBlur}
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
