import React from 'react';

import scss from 'components/UI/Buttons/Button/Button.module.scss';
import clsx from 'clsx';

interface ButtonProps {
    onClick: () => void;
    children: string | string[];
    disabled?: boolean;
    nowrap?: boolean;
    type: HTMLButtonElement['type'];
    active?: boolean;
    rounded?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled,
    type,
    children,
    active,
    rounded = true,
    nowrap = false,
}) => {
    const buttonClass = clsx({
        [scss.button]: !active && rounded,
        [scss.button_active]: active && rounded,
        [scss.button_rect]: !rounded,
        [scss.button_rect_active]: !rounded && active,
    });

    return (
        <button
            style={nowrap ? { whiteSpace: 'nowrap' } : undefined}
            disabled={disabled}
            type={type}
            className={buttonClass}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
