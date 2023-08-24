import React from 'react';

import scss from './Button.module.scss';

interface ButtonProps {
    onClick: () => void;
    children: string;
    type: HTMLButtonElement['type'];
}
export const Button: React.FC<ButtonProps> = ({ onClick, type, children }) => {
    return (
        <button type={type} className={scss.button} onClick={onClick}>
            {children}
        </button>
    );
};
