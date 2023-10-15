'use server';

import React from 'react';
import Link from 'next/link';

import { IOrganization, IUser } from 'store/types';
import { getOrganizations } from 'http/organizationApi';
import { NotificationsContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Notifications';
import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { BurgerMenu } from 'app/(Main)/components/Header/components/BurgerMenu';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { getUser } from 'http/userApi';
import { IService } from 'http/types';
import { Organization } from 'app/(Main)/components/Header/components/Organization';

import scss from './Header.module.scss';
import { HeaderNavTablet } from 'app/(Main)/components/Header/components/HeaderNavTablet/HeaderNavTablet';

interface HeaderProps {
    disabled: boolean;
    services: IService;
}

export const Header: React.FC<HeaderProps> = async ({ disabled, services }) => {
    const user = await getUser().catch((e: AxiosError) => {
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
                <div className={scss.tools_wrapper}>
                    <Organization
                        size="pc"
                        disabled={disabled}
                        organizations={organizations}
                    />
                    <NotificationsContainer />
                    <HeaderDropdown
                        subs={services.serviceRates}
                        userData={user as IUser}
                    />
                </div>
            </div>
            <HeaderNavTablet
                subs={services.serviceRates}
                disabled={disabled}
                organizations={organizations}
                user={user as IUser}
            />
        </header>
    );
};
