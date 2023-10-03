import Input from 'react-input-mask';
import React from 'react';
import clsx from 'clsx';

import { InputMaskProps } from 'components/UI/Inputs/InputMask/InputMask.types';
import scss from 'components/UI/Inputs/Input/Input.module.scss';

export const InputMask = ({
    handleError,
    mask,
    alwaysShowMask,
    placeholder,
    autoFocus,
    value,
    name,
    onChange,
    onBlur,
    label,
    type,
    maskPlaceholder,
    size = 'medium',
    needErrorLabel = true,
    autoComplete,
    disabled,
}: InputMaskProps) => {
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
        <div className={fieldClass}>
            {label ? (
                <label className={labelClass}>{label}</label>
            ) : (
                <label className={labelErrorClass}>{handleError}</label>
            )}
            <Input
                disabled={disabled}
                autoComplete={autoComplete}
                maskPlaceholder={maskPlaceholder}
                type={type}
                className={inputClass}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                value={value}
                alwaysShowMask={alwaysShowMask}
                mask={mask}
                autoFocus={autoFocus}
                id={name}
                name={name}
                placeholder={placeholder}
                onBlur={onBlur}
            />
            {label && <label className={labelErrorClass}>{handleError}</label>}
        </div>
    );
};
