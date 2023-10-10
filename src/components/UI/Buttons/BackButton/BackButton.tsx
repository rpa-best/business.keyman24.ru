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
    skipWord?: boolean;
    skipTwoWords?: boolean;
    onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
    absolute,
    children,
    skipNumber = true,
    skipWord = false,
    skipTwoWords = false,
    onClick,
}) => {
    const router = useRouter();

    const pathName = usePathname();

    const slashIndex = pathName.lastIndexOf('/');

    const routeWithoutSlash = pathName.slice(0, slashIndex);
    const handleButtonClick = () => {
        if (onClick) {
            onClick();
        }
        if (skipNumber && skipWord) {
            // @ts-ignore
            const itsNumber = !isNaN(pathName.at(-1));

            if (itsNumber) {
                const wordSlashIndex = routeWithoutSlash.lastIndexOf('/');
                const routeWithoutWord = pathName.slice(0, wordSlashIndex);
                router.push(
                    routeWithoutWord.slice(0, routeWithoutSlash.length - 1)
                );
            } else {
                const wordSlashIndex = routeWithoutSlash.lastIndexOf('/');
                const routeWithoutWord = pathName.slice(0, wordSlashIndex);
                router.push(routeWithoutWord);
            }
        } else if (skipNumber) {
            // @ts-ignore
            const itsNumber = !isNaN(routeWithoutSlash?.at(-1));
            if (itsNumber) {
                router.push(
                    routeWithoutSlash.slice(0, routeWithoutSlash.length - 1)
                );
            } else if (skipTwoWords) {
                const secondSlashIndex = routeWithoutSlash.lastIndexOf('/');
                const secondRouteWithoutSlash = routeWithoutSlash.slice(
                    0,
                    secondSlashIndex
                );
                router.push(secondRouteWithoutSlash);
            } else {
                router.push(routeWithoutSlash);
            }
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
