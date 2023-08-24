'use client';

import React from 'react';
import Link from 'next/link';

import SettingsSvg from 'app/(Main)/components/Header/components/svg/settings.svg';
import { usePathname } from 'next/navigation';

import scss from 'app/(Main)/components/Header/Header.module.scss';

export const SettingsSvgContainer = () => {
    const href = '/org-settings';
    const active = usePathname() === href;

    return (
        <Link className={scss.settings_svg_wrapper} href={href}>
            <SettingsSvg
                className={
                    active ? scss.settings_svg_active : scss.settings_svg
                }
            />
        </Link>
    );
};
