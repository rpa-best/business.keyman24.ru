'use client';

import Link from 'next/link';
import React from 'react';

import NotificationSvg from 'app/(Main)/components/Header/components/svg/notification.svg';
import MessagesSvg from 'app/(Main)/components/Header/components/svg/messages.svg';

import scss from 'app/(Main)/components/Header/Header.module.scss';

export const NotificationsContainer = () => {
    return (
        <div className={scss.notifications_wrapper}>
            <Link className={scss.first_icon} href="/">
                <NotificationSvg className={scss.svg_icon} />
            </Link>
            <Link className={scss.second_icon} href="/">
                <MessagesSvg className={scss.svg_icon} />
            </Link>
        </div>
    );
};
