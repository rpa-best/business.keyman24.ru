'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSpring } from 'framer-motion';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { onHide, onMount } from 'utils/TippyHelper';
import ArrowSvg from '/public/svg/arrow.svg';
import { ColorRadialInputSelectProps } from 'app/(Main)/components/FiltersContainer/components/ColorRadialInputSelect/types';

import scss from './ColorRadialInput.module.scss';
import ExitSvg from '/public/svg/x.svg';
import { InputSelectList } from './InputSelectList';

export const ColorRadialInputSelect: React.FC<ColorRadialInputSelectProps> = ({
    listValues,
    showPrevValue,
    label,
    value,
    placeholder,
    onChange,
    selectedValues,
    handleDeleteOne,
}) => {
    const opacity = useSpring(0);
    const [type, setType] = useState<'text' | 'input'>('text');

    const [inputValue, setInputValue] = useState(value);
    const [visible, setVisible] = useState(false);
    const [modifiedListValues, setModifiedListValues] = useState(listValues);

    const prevValue = useRef(value);

    useEffect(() => {
        if (selectedValues?.length === 1) {
            setModifiedListValues(
                [...listValues].filter((v) => {
                    return v.name !== value;
                })
            );
        } else {
            setModifiedListValues(
                [...listValues].filter((v) => {
                    return !selectedValues?.some((el) => el.id === v.id);
                })
            );
        }
    }, [listValues, selectedValues, value]);

    useEffect(() => {
        setInputValue(value);
        prevValue.current = value;
    }, [value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setInputValue(inputValue);

        // Фильтруем список на основе inputValue
        const filteredList = listValues.filter(
            (item) =>
                item.name.includes(inputValue) &&
                item.name !== prevValue.current
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
        [scss.input_arrow_svg]: true,
        [scss.input_arrow_svg_open]: visible,
    });

    const fieldClass = clsx({
        [scss.field]: !label,
        [scss.field_with_label]: label,
    });

    const labelClass = clsx({
        [scss.input_label]: true,
    });

    const inputClass = clsx({
        [scss.input_select]: true,
    });

    return (
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
            <div className={fieldClass}>
                {label && <label className={labelClass}>{label}</label>}
                <div
                    onClick={() => {
                        setType('input');
                        setInputValue('');
                    }}
                    className={scss.input_wrapper}
                >
                    <input
                        placeholder={
                            prevValue.current ? prevValue.current : placeholder
                        }
                        onFocus={() => {
                            setVisible(true);
                        }}
                        autoComplete="new-password"
                        className={inputClass}
                        onChange={handleInputChange}
                        value={inputValue}
                    />
                    {type === 'text' && (
                        <div className={scss.pseudo_inputs}>
                            {selectedValues?.map((el, index) => (
                                <div key={index} className={scss.pseudo_input}>
                                    {el.name}
                                    <ExitSvg
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            (handleDeleteOne as any)(el.id);
                                        }}
                                        className={scss.svg}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <ArrowSvg className={arrowClassname} />
                </div>
            </div>
        </Tippy>
    );
};
