'use client';

import React from 'react';

import clsx from 'clsx';
import ArrowSvg from '/public/svg/arrow.svg';

import scss from './BackButton.module.scss';
import { usePathname, useRouter } from 'next/navigation';

interface BackButtonProps {
    children: string;
    absolute?: boolean;
    skipNumber?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
    absolute,
    children,
    skipNumber = true,
}) => {
    const router = useRouter();

    const pathName = usePathname();

    const handleButtonClick = () => {
        if (skipNumber) {
            const slashIndex = pathName.lastIndexOf('/');
            const routerWithoutSlash = pathName.slice(0, slashIndex);

            // @ts-ignore
            const itsNumber = !isNaN(routerWithoutSlash?.at(-1));
            if (itsNumber) {
                router.push(
                    routerWithoutSlash.slice(0, routerWithoutSlash.length - 1)
                );
            } else {
                router.push(routerWithoutSlash);
            }
        } else {
            const slashIndex = pathName.lastIndexOf('/');
            router.push(pathName.slice(0, slashIndex));
        }
    };

    const buttonClass = clsx({
        [scss.link_button]: !absolute,
        [scss.link_button_absolute]: absolute,
    });

    return (
        <div
            onClick={() => handleButtonClick()}
            className={scss.button_wrapper}
        >
            <ArrowSvg className={scss.button_svg} />
            <button className={buttonClass}>{children}</button>
        </div>
    );
};
