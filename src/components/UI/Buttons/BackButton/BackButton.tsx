'use client';

import React from 'react';

import clsx from 'clsx';
import ArrowSvg from '/public/svg/arrow.svg';

import scss from './BackButton.module.scss';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
    children: string;
    absolute?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
    absolute,
    children,
}) => {
    const router = useRouter();

    const buttonClass = clsx({
        [scss.link_button]: !absolute,
        [scss.link_button_absolute]: absolute,
    });

    return (
        <div onClick={() => router.back()} className={scss.button_wrapper}>
            <ArrowSvg className={scss.button_svg} />
            <button className={buttonClass}>{children}</button>
        </div>
    );
};
