import React, { ChangeEventHandler } from 'react';

import * as T from 'components/UI/Inputs/types';
import clsx from 'clsx';
import XSvg from '/public/svg/x.svg';

import scss from 'components/UI/Inputs/Input/Input.module.scss';

export const Input: React.FC<T.IInputProps> = ({
    type = 'text',
    placeholder,
    autoFocus,
    value,
    name,
    clearable,
    handleError,
    onChange,
    onBlur,
    style,
    autoComplete,
    disabled,
    tabIndex,
    errorFontColor,
    rounded,
    label,
    size = 'medium',
    needErrorLabel = true,
}) => {
    const fieldClass = clsx({
        [scss.field_noneed]: !needErrorLabel,
        [scss.field]: size === 'medium' && !label,
        [scss.field_big]: size === 'big' && !label,
        [scss.field_with_label_big]: size === 'big' && label,
        [scss.field_with_label]: size === 'medium' && label,
    });

    const labelErrorClass = clsx({
        [scss.input_error_label]: handleError,
        [scss.input_error_label_hidden]: !handleError,
    });

    const labelClass = clsx({
        [scss.input_label]: label && label?.length <= 25,
        [scss.input_label_small]: label && label?.length >= 25,
    });

    const inputClass = clsx({
        [scss.input]: size === 'medium' && !rounded,
        [scss.input_rounded]: size === 'medium' && rounded,
        [scss.input_big]: size === 'big' && !rounded,
        [scss.input_big_rounded]: size === 'big' && rounded,
        [scss.input_error]: handleError,
    });
    const handleClearClick = () => {
        onChange('' as any);
    };

    return (
        <div style={style} className={fieldClass}>
            {label ? (
                <label className={labelClass}>{label}</label>
            ) : (
                <label className={labelErrorClass}>{handleError}</label>
            )}
            <input
                style={handleError ? { color: errorFontColor } : undefined}
                tabIndex={tabIndex}
                autoComplete={autoComplete as string}
                className={inputClass}
                type={type}
                onChange={onChange as ChangeEventHandler<HTMLInputElement>}
                value={value}
                autoFocus={autoFocus}
                id={name}
                name={name}
                placeholder={placeholder}
                onBlur={onBlur}
                disabled={disabled}
            />
            {clearable && (
                <XSvg onClick={handleClearClick} className={scss.custom_svg} />
            )}
            {label && <label className={labelErrorClass}>{handleError}</label>}
        </div>
    );
};
