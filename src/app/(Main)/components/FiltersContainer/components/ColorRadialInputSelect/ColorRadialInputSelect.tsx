'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSpring, motion } from 'framer-motion';
import clsx from 'clsx';
import ExitSvg from '/public/svg/x.svg';
import { InputSelectList } from './InputSelectList';
import Tippy from '@tippyjs/react';
import { onHide, onMount } from 'utils/TippyHelper';
import ArrowSvg from '/public/svg/arrow.svg';
import { ColorRadialInputSelectProps } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/types';

import scss from './ColorRadialInput.module.scss';
import { PseudoInputs } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/PseudoInputs';

export const ColorRadialInputSelect: React.FC<ColorRadialInputSelectProps> = ({
    listValues,
    showPrevValue,
    label,
    value,
    placeholder,
    onChange,
    bgColor = '#31D79B',
    selectedValues,
    handleDeleteOne,
}) => {
    const opacity = useSpring(0);
    const [type, setType] = useState<'text' | 'input'>('text');

    const inputRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState(value);
    const [visible, setVisible] = useState(false);
    const [modifiedListValues, setModifiedListValues] = useState(listValues);

    const prevValue = useRef(value);

    useEffect(() => {
        if (selectedValues?.length !== 1 && selectedValues) {
            setModifiedListValues(
                [...listValues].filter((v) => {
                    return !selectedValues?.some((el) => el.id === v.id);
                })
            );
        } else {
            setModifiedListValues(
                [...listValues].filter((v) => {
                    return v.name !== value;
                })
            );
        }
    }, [listValues, selectedValues, value]);

    useEffect(() => {
        setInputValue(value);
        prevValue.current = value;
    }, [value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.toLowerCase();
        setInputValue(e.target.value);

        // Фильтруем список на основе inputValue
        const filteredList = listValues.filter(
            (item) =>
                item.name.toLowerCase().includes(inputValue) &&
                item.name.toLowerCase() !== prevValue.current.toLowerCase()
        );

        // Устанавливаем отфильтрованный список в modifiedListValues
        setModifiedListValues(filteredList);
    };

    const handleSetData = (id: number) => {
        onChange(listValues.find((item) => item.id === id));
        setVisible(!visible);
        setType('text');
    };

    const onClickOutside = () => {
        setVisible(!visible);
        setType('text');
        if (showPrevValue) {
            setInputValue(prevValue.current);
        }
    };

    const arrowClassname = clsx({
        [scss.input_arrow_svg]: selectedValues,
        [scss.input_arrow_svg_single]: !selectedValues,
        [scss.input_arrow_svg_open]: visible,
    });

    const fieldClass = clsx({
        [scss.field_without_label]: true,
    });

    const wrapperClass = clsx({
        [scss.input_radial_wrapper]: true,
    });

    const labelClass = clsx({
        [scss.input_label]: true,
    });

    const inputClass = clsx({
        [scss.input_select]: selectedValues ? selectedValues.length <= 2 : true,
        [scss.input_select_many]: selectedValues
            ? selectedValues.length > 2
            : false,
    });

    const handleChangeType = () => {
        setType('input');
    };

    useEffect(() => {
        if (type === 'input') {
            inputRef.current?.focus();
        }
    }, [type]);

    return (
        <>
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                interactive={true}
                visible={visible}
                placement="bottom"
                onClickOutside={onClickOutside}
                offset={[0, 5]}
                render={(attrs) => (
                    <InputSelectList
                        {...attrs}
                        opacity={opacity}
                        handleSetData={handleSetData}
                        list={modifiedListValues}
                    />
                )}
            >
                <div style={{ height: 'max-content' }}>
                    <div
                        style={{
                            display: type === 'input' ? 'flex' : 'none',
                        }}
                        className={fieldClass}
                    >
                        {label && <label className={labelClass}>{label}</label>}
                        <div className={wrapperClass}>
                            <input
                                placeholder={
                                    prevValue.current
                                        ? prevValue.current
                                        : placeholder
                                }
                                onFocus={() => {
                                    setVisible(true);
                                    setInputValue('');
                                }}
                                ref={inputRef}
                                autoComplete="new-password"
                                className={inputClass}
                                onChange={handleInputChange}
                                value={inputValue}
                            />
                        </div>
                    </div>
                    {type === 'text' && (
                        <PseudoInputs
                            handleChangeType={handleChangeType}
                            selectedValues={selectedValues}
                            inputValue={inputValue}
                            bgColor={bgColor}
                            handleDeleteOne={handleDeleteOne}
                        />
                    )}
                    <ArrowSvg className={arrowClassname} />
                </div>
            </Tippy>
        </>
    );
};
