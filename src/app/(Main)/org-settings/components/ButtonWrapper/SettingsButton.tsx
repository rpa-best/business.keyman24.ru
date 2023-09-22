'use client';

import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';

import scss from 'app/(Main)/org-settings/OrganizationSettings.module.scss';

export const SettingsButton = () => {
    const router = useRouter();
    const path = usePathname();

    return (
        <div className={scss.button_wrapper}>
            <Button type="button" onClick={() => router.push(path + '/bill')}>
                Баланс
            </Button>
        </div>
    );
};
