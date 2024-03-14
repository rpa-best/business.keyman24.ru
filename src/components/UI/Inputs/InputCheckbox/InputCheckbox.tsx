import { InputCheckboxProps } from './InputCheckbox.types';

import clsx from 'clsx';
import css from './InputCheckbox.module.scss';

export const InputCheckbox = ({
    name,
    label,
    type,
    value,
    onChange,
    theme = 'dark',
}: InputCheckboxProps) => {
    const dark = theme === 'dark';

    const fontClass = clsx({
        [css.input_description]: dark,
        [css.input_description_light]: !dark,
    });

    return (
        <div className={css.input_container}>
            <div className={css.input_wrapper}>
                {label && (
                    <label className={fontClass} htmlFor={name}>
                        {label}
                    </label>
                )}
                <label
                    htmlFor={name}
                    className={
                        value ? css.pseudo_input_active : css.pseudo_input
                    }
                >
                    <input
                        id={name}
                        className={css.input}
                        onChange={() => {
                            onChange(!value);
                        }}
                        name={name}
                        type={type}
                        checked={value}
                    />
                </label>
            </div>
        </div>
    );
};
