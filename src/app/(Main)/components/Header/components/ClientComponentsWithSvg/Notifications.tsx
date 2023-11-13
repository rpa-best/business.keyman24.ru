'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import NotificationSvg from 'app/(Main)/components/Header/components/svg/notification.svg';
import MessagesSvg from 'app/(Main)/components/Header/components/svg/messages.svg';
import { IUser } from 'store/types';

import scss from 'app/(Main)/components/Header/Header.module.scss';
import { useSocketConnect } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/hooks/useSocketConnect';

interface NotificationsContainerProps {
    user: IUser;
}

export const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
    user,
}) => {
    const socket = useSocketConnect(
        `business/ws/notification/${user.username}/`
    );

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
