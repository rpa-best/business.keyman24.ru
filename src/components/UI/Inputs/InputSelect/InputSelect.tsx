import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Tippy from '@tippyjs/react/headless';
import { useSpring } from 'framer-motion';

import * as T from 'components/UI/Inputs/types';
import { onHide, onMount } from 'utils/TippyHelper';
import { InputSelectList } from 'components/UI/Inputs/InputSelect/InputSelectList';
import Arrow from '/public/svg/arrow.svg';

import scss from 'components/UI/Inputs/InputSelect/InputSelect.module.scss';

export const InputSelect: React.FC<T.IInputSelectProps> = ({
    type = 'text',
    placeholder,
    autoFocus,
    value,
    name,
    label,
    handleError,
    onBlur,
    onChange,
    style,
    autoComplete,
    setFieldTouched,
    disabled,
    tabIndex,
    size = 'medium',
    needErrorLabel = true,
    rounded,
    listValues,
    showPrevValue = true,
}) => {
    const opacity = useSpring(0);

    const [inputValue, setInputValue] = useState(value);
    const [visible, setVisible] = useState(false);
    const [modifiedListValues, setModifiedListValues] = useState(listValues);

    const prevValue = useRef(value);

    useEffect(() => {
        setModifiedListValues(
            [...listValues].filter((v) => {
                return v.name !== value;
            })
        );
    }, [listValues, value]);

    useEffect(() => {
        setInputValue(value);
        prevValue.current = value;
    }, [value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (setFieldTouched) {
            setFieldTouched(name, true);
        }
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
    };

    const onClickOutside = () => {
        setVisible(!visible);
        if (showPrevValue) {
            setInputValue(prevValue.current);
        }
        if (setFieldTouched) {
            setFieldTouched(name, true);
        }
    };

    const offset: [number, number] =
        label && needErrorLabel ? [0, -10] : [0, 0];

    const arrowClassname = clsx({
        [scss.input_arrow_svg]: true,
        [scss.input_arrow_svg_open]: visible,
    });

    const fieldClass = clsx({
        [scss.field_noneed]: !needErrorLabel,
        [scss.field]: size === 'medium' && !label,
        [scss.field_big]: size === 'big' && !label,
        [scss.field_with_label_big]: size === 'big' && label,
        [scss.field_with_label]: size === 'medium' && label && needErrorLabel,
    });

    const labelErrorClass = clsx({
        [scss.input_error_label]: handleError,
        [scss.input_error_label_hidden]: !handleError,
    });

    const labelClass = clsx({
        [scss.input_label]: true,
    });

    const inputClass = clsx({
        [scss.input]: size === 'medium' && !rounded,
        [scss.input_rounded]: size === 'medium' && rounded,
        [scss.input_big]: size === 'big' && !rounded,
        [scss.input_big_rounded]: size === 'big' && rounded,
        [scss.input_error]: handleError,
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
            offset={offset}
            render={(attrs) => (
                <InputSelectList
                    {...attrs}
                    opacity={opacity}
                    handleSetData={handleSetData}
                    list={modifiedListValues}
                />
            )}
        >
            <div style={style} className={fieldClass}>
                {label ? (
                    <label className={labelClass}>{label}</label>
                ) : (
                    <label className={labelErrorClass}>{handleError}</label>
                )}
                <div
                    onClick={() => setVisible(true)}
                    className={scss.input_wrapper}
                >
                    <input
                        onFocus={() => {
                            setVisible(true);
                            setInputValue('');
                        }}
                        tabIndex={tabIndex}
                        autoComplete={autoComplete as string}
                        className={inputClass}
                        onBlur={onBlur}
                        type={type}
                        onChange={handleInputChange}
                        value={inputValue}
                        autoFocus={autoFocus}
                        id={name}
                        name={name}
                        placeholder={
                            prevValue.current ? prevValue.current : placeholder
                        }
                        disabled={disabled}
                    />
                    <Arrow className={arrowClassname} />
                </div>
                {label && (
                    <label className={labelErrorClass}>{handleError}</label>
                )}
            </div>
        </Tippy>
    );
};
