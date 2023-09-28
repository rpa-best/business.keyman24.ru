'use client';

import React from 'react';
import Link from 'next/link';

import SettingsSvg from 'app/(Main)/components/Header/components/svg/settings.svg';
import { usePathname } from 'next/navigation';

import scss from 'app/(Main)/components/Header/Header.module.scss';

export const SettingsSvgContainer = ({
    disabled = false,
}: {
    disabled?: boolean;
}) => {
    const href = '/org-settings';
    const active = usePathname().startsWith(href);

    return (
        <Link
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            className={scss.settings_svg_wrapper}
            href={href}
        >
            <SettingsSvg
                className={
                    active ? scss.settings_svg_active : scss.settings_svg
                }
            />
        </Link>
    );
};
