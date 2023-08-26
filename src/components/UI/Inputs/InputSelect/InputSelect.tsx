import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Tippy from '@tippyjs/react/headless';
import { useSpring } from 'framer-motion';

import ArrowSvg from '/public/svg/arrow.svg';
import * as T from 'components/UI/Inputs/types';
import { onHide, onMount } from 'utils/TippyHelper';
import { InputSelectList } from 'components/UI/Inputs/InputSelect/InputSelectList';

import scss from 'components/UI/Inputs/InputSelect/InputSelect.module.scss';
import Arrow from '/public/svg/arrow.svg';

export const InputSelect: React.FC<T.IInputSelectProps> = ({
    type = 'text',
    placeholder,
    autoFocus,
    value,
    name,
    handleError,
    onChange,
    style,
    autoComplete,
    setFieldTouched,
    disabled,
    tabIndex,
    size = 'medium',
    needErrorLabel = true,
    listValues,
}) => {
    const opacity = useSpring(0);

    const [inputValue, setInputValue] = useState(value);
    const [visible, setVisible] = useState(false);
    const [modifiedListValues, setModifiedListValues] = useState(listValues);

    const prevValue = useRef(value);

    const fieldClass = clsx({
        [scss.field_noneed]: !needErrorLabel,
        [scss.field]: size === 'medium',
        [scss.field_big]: size === 'big',
    });

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
        if (setFieldTouched) {
            setFieldTouched(name, true);
        }
        setInputValue(e.target.value);
    };

    const handleSetData = (id: number) => {
        onChange(listValues.find((item) => item.id === id));
        setVisible(!visible);
    };

    const onClickOutside = () => {
        setVisible(!visible);
        setInputValue(prevValue.current);
        if (setFieldTouched) {
            setFieldTouched(name, true);
        }
    };

    const arrowClassname = clsx({
        [scss.input_arrow_svg]: true,
        [scss.input_arrow_svg_open]: visible,
    });

    const labelClass = clsx({
        [scss.input_error_label]: handleError,
        [scss.input_error_label_hidden]: !handleError,
    });

    const inputClass = clsx({
        [scss.input]: size === 'medium',
        [scss.input_big]: size === 'big',
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
                <label className={labelClass}>{handleError}</label>
                <div
                    onClick={() => setVisible(true)}
                    className={scss.input_wrapper}
                >
                    <input
                        onFocus={() => setVisible(true)}
                        tabIndex={tabIndex}
                        autoComplete={autoComplete as string}
                        className={inputClass}
                        type={type}
                        onChange={handleInputChange}
                        value={inputValue}
                        autoFocus={autoFocus}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                    <Arrow className={arrowClassname} />
                </div>
            </div>
        </Tippy>
    );
};
