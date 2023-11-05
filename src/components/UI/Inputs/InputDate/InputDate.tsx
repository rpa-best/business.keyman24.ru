import Input from 'react-input-mask';
import React from 'react';
import clsx from 'clsx';

import ru from 'date-fns/locale/ru';
import DatePicker from 'react-datepicker';
import { InputDateProps } from 'components/UI/Inputs/InputDate/InputDate.types';
import CalendarSvg from './icons/Calendar.svg';

import 'react-datepicker/dist/react-datepicker.css';
import scss from './InputDate.module.scss';

export const InputDate = ({
    handleError,
    mask,
    alwaysShowMask,
    placeholder,
    value,
    name,
    onChange,
    onBlur,
    label,
    disabled,
}: InputDateProps) => {
    const fieldClass = clsx({
        [scss.field]: !label,
        [scss.field_with_label]: label,
    });

    return (
        <div className={fieldClass}>
            <label className={scss.input_label}>{label}</label>
            <div onClick={onBlur} className={scss.input_wrapper}>
                <DatePicker
                    disabled={disabled}
                    locale={ru}
                    dateFormat="dd.MM.yyyy"
                    selected={value}
                    onChange={(date) => {
                        onChange(date as Date);
                    }}
                    calendarClassName={scss.calendar}
                    customInput={
                        <Input
                            disabled={disabled}
                            className={
                                handleError ? scss.input_error : scss.input
                            }
                            mask={mask}
                            alwaysShowMask={alwaysShowMask}
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            onBlur={onBlur}
                        />
                    }
                />
                <CalendarSvg className={scss.calendar_svg} />
            </div>
            {handleError && (
                <label className={scss.input_error_label}>{handleError}</label>
            )}
        </div>
    );
};
