'use client';
import React from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { usePathname, useRouter } from 'next/navigation';

import scss from './Nav.module.scss';

export const Nav = () => {
    const router = useRouter();
    const path = usePathname();

    return (
        <div className={scss.buttons_wrapper}>
            <div className={scss.button}>
                <Button
                    active={path === '/org-settings/bill'}
                    onClick={() => {
                        router.push('/org-settings/bill');
                    }}
                    type="button"
                >
                    Баланс
                </Button>
            </div>
            <div className={scss.button}>
                <Button
                    active={path === '/org-settings/bill/bill-history'}
                    onClick={() =>
                        router.push('/org-settings/bill/bill-history')
                    }
                    type="button"
                >
                    История операций
                </Button>
            </div>
        </div>
    );
};
