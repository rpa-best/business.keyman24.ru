'use client';
import React from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { usePathname, useRouter } from 'next/navigation';

import scss from './Nav.module.scss';
import Link from 'next/link';

export const Nav = () => {
    const router = useRouter();
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
