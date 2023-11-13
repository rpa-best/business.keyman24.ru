'use server';

import React from 'react';
import Link from 'next/link';

import { IUser } from 'store/types';
import { getOrganizations } from 'http/organizationApi';
import { NotificationsContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Notifications';
import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { getUser } from 'http/userApi';
import { IService } from 'http/types';
import { Organization } from 'app/(Main)/components/Header/components/Organization';
import { HeaderNavTablet } from 'app/(Main)/components/Header/components/HeaderNavTablet/HeaderNavTablet';
import { cookies } from 'next/headers';

import scss from './Header.module.scss';
import { Tools } from 'app/(Main)/components/Header/components/Tools';

interface HeaderProps {
    disabled: boolean;
    services: IService;
}

export const Header: React.FC<HeaderProps> = async ({ disabled, services }) => {
    const cookieStore = cookies();

    const access = cookieStore.get('access')?.value;

    const user = await getUser(access as string).catch((e: AxiosError) => {
        if (e.response?.status === 401) {
            redirect('/login');
        }
    });

    const organizations = await getOrganizations().catch((e) => e);

    return (
        <header className={scss.header_layout}>
            <div className={scss.header_nav}>
                <Link
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                    className={scss.title_wrapper}
                    href="/"
                >
                    <h2 className={scss.title}>KeyMan24</h2>
                    <span className={scss.separator} />
                    <h2 className={scss.title_second}>Business</h2>
                </Link>
                <Tools
                    subs={services?.serviceRates}
                    disabled={disabled}
                    organizations={organizations}
                    user={user as IUser}
                />
            </div>
            <HeaderNavTablet
                subs={services?.serviceRates}
                disabled={disabled}
                organizations={organizations}
                user={user as IUser}
            />
        </header>
    );
};
