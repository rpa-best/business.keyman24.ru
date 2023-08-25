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
    size = 'medium',
    needErrorLabel = true,
}) => {
    const fieldClass = clsx({
        [scss.field_noneed]: !needErrorLabel,
        [scss.field]: size === 'medium',
        [scss.field_big]: size === 'big',
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
        <div style={style} className={fieldClass}>
            <label className={labelClass}>{handleError}</label>
            <div className={scss.input_wrapper}>
                <input
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
            </div>
        </div>
    );
};
