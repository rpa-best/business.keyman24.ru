'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

import BillSvg from './svg/bill.svg';
import SettingsSvg from './svg/settings.svg';

import scss from 'app/(Main)/org-settings/OrganizationSettings.module.scss';

export const NavButtons = () => {
    const path = usePathname();

    const org = path === '/org-settings';

    return (
        <div className={scss.buttons_wrapper}>
            <Link
                href="/org-settings"
                className={
                    org ? scss.button_wrapper_active : scss.button_wrapper
                }
            >
                <div>
                    <SettingsSvg />
                    <p>Настройки</p>
                </div>

                {org && (
                    <motion.div
                        className={scss.underline}
                        layoutId="underline"
                    />
                )}
            </Link>
            <Link
                href="org-settings/bill"
                className={
                    !org ? scss.button_wrapper_active : scss.button_wrapper
                }
            >
                <div>
                    <BillSvg />
                    <p>Баланс</p>
                </div>

                {!org && (
                    <motion.div
                        className={scss.underline}
                        layoutId="underline"
                    />
                )}
            </Link>
        </div>
    );
};
