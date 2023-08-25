import React from 'react';

import scss from 'components/UI/Buttons/Button/Button.module.scss';

interface ButtonProps {
    onClick: () => void;
    children: string;
    disabled?: boolean;
    nowrap?: boolean;
    type: HTMLButtonElement['type'];
}
export const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled,
    type,
    children,
    nowrap = false,
}) => {
    return (
        <button
            style={nowrap ? { whiteSpace: 'nowrap' } : undefined}
            disabled={disabled}
            type={type}
            className={scss.button}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
