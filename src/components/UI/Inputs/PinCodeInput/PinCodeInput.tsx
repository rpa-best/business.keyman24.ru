import React, { useRef, useEffect, KeyboardEvent } from 'react';

import css from './PinCodeInput.module.scss';
import { FormikErrors } from 'formik';

export interface IPinCodeInputProps {
    digits: string[];
    validateForm: () => void;
    changeHandler: (
        values: React.SetStateAction<string[]>,
        shouldValidate?: boolean
    ) => Promise<any>;
    errors: FormikErrors<{ code: string }>;
}

export const PinCodeInput: React.FC<IPinCodeInputProps> = ({
    digits,
    validateForm,
    changeHandler,
    errors,
}) => {
    const length = digits.length;
    // здесь будут ссылки на input-элементы
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    const handleKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === 'Backspace') {
            if (digits[index].match(/^[0-9]$/)) {
                // если элемент массива digits содержит цифру, то при нажатии клавиши
                // вызываем callback-функцию родителя, чтобы записать пустую строку
                const newDigits = [...digits]; // копия digits
                newDigits[index] = '';
                changeHandler(newDigits, true);
                if (index > 0) inputRefs.current[index - 1].focus();
            } else {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleChange = async (index: number, newValue: string) => {
        const letterRegex = /[a-zA-Z]/;
        if (newValue.length > 6) {
            newValue = newValue.slice(0, 6);
        }
        if (letterRegex.test(newValue)) {
            return;
        }
        if (newValue.length > 1) {
            const coppiedValues = newValue.split('');
            const newDigits = [...digits];
            coppiedValues.forEach((el, index) => {
                newDigits[index] = el;
            });
            await changeHandler(newDigits);
            if (coppiedValues.length === 6) {
                inputRefs.current[index].blur();
            } else {
                inputRefs.current[coppiedValues.length].focus();
            }
            return;
        }
        const oldDigit = digits[index];
        // старую цифру в поле ввода убираем, оставляя только новую
        const newDigit = newValue.trim().replace(oldDigit, '');
        // если это не цифра, ничего не делаем, пока не будет цифры
        if (newDigit < '0' || newDigit > '9') return;
        // теперь вызываем callback родителя, чтобы обовить digits
        const newDigits = [...digits]; // копия digits
        newDigits[index] = newDigit;
        await changeHandler(newDigits);
        // смещаем фокус на следующее поле для ввода следующей цифры
        if (index < length - 1) {
            inputRefs.current[index + 1].focus();
        } else {
            // или убираем фокус, если это было последнее поле
            inputRefs.current[index].blur();
        }
    };

    return (
        <div className={css.pin_code_input_wrapper}>
            <div className={css.inputs_wrapper}>
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        className={
                            errors.code ? css.input_cell_error : css.input_cell
                        }
                        value={digit}
                        onBlur={() => validateForm()}
                        onChange={(event) =>
                            handleChange(index, event.target.value)
                        }
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        ref={(element) =>
                            (inputRefs.current[index] =
                                element as HTMLInputElement)
                        }
                    />
                ))}
            </div>
            {errors.code && (
                <label
                    style={{ textAlign: 'center' }}
                    className={css.input_error_label}
                >
                    {errors.code}
                </label>
            )}
        </div>
    );
};
