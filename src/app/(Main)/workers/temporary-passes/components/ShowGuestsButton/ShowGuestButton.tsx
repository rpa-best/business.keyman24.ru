'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'components/UI/Buttons/Button';
import { useSearchParams } from 'next/navigation';

import scss from 'app/(Main)/workers/temporary-passes/temporary-passess.module.scss';

export const ShowGuestButton = () => {
    const params = useSearchParams();

    const showGuest = params.get('guest') ?? false;

    return (
        <div className={scss.guest_button_wrapper}>
            {showGuest ? (
                <Link href="/workers/temporary-passes">
                    <Button onClick={() => {}} type="button">
                        Показать работников
                    </Button>
                </Link>
            ) : (
                <Link href="/workers/temporary-passes/?guest=true">
                    <Button onClick={() => {}} type="button">
                        Показать гостей
                    </Button>
                </Link>
            )}
        </div>
    );
};
