import React, { ChangeEventHandler } from 'react';

import * as T from 'components/UI/Inputs/types';
import clsx from 'clsx';

import scss from 'components/UI/Inputs/Input/Input.module.scss';

export const Input: React.FC<T.IInputProps> = ({
    type = 'text',
    placeholder,
    autoFocus,
    value,
    name,

    handleError,
    onChange,
    onBlur,
    style,
    autoComplete,
    disabled,
    tabIndex,
    errorFontColor,
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
        [scss.input_label]: true,
    });

    const inputClass = clsx({
        [scss.input]: size === 'medium',

        [scss.input_big]: size === 'big',

        [scss.input_error]: handleError,
    });

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
            {label && <label className={labelErrorClass}>{handleError}</label>}
        </div>
    );
};
