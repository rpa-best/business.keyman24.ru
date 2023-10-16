'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from 'components/UI/Buttons/Button';

import scss from './Nav.module.scss';

export const Nav = () => {
    const path = usePathname();

    return (
        <div className={scss.buttons_wrapper}>
            <Link href="/org-settings/bill" className={scss.button}>
                <Button
                    active={path === '/org-settings/bill'}
                    onClick={() => {}}
                    type="button"
                >
                    Баланс
                </Button>
            </Link>
            <Link
                href="/org-settings/bill/bill-history"
                className={scss.button}
            >
                <Button
                    active={path === '/org-settings/bill/bill-history'}
                    onClick={() => {}}
                    type="button"
                >
                    История операций
                </Button>
            </Link>
        </div>
    );
};
