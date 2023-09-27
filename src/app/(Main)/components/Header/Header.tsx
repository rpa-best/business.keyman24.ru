'use server';

import React from 'react';
import Link from 'next/link';

import { IOrganization, IUser } from 'store/types';
import { getOrganizations } from 'http/organizationApi';
import { SettingsSvgContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Settings';
import { HeaderInputSelect } from 'app/(Main)/components/Header/components/InputSelect';
import { NotificationsContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Notifications';
import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { BurgerMenu } from 'app/(Main)/components/Header/components/BurgerMenu';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { getUser, headCheckPaths } from 'http/userApi';

import scss from './Header.module.scss';
import { cookies } from 'next/headers';

interface HeaderProps {
    disabled: boolean;
    headCheck: (string | void)[];
}

export const Header: React.FC<HeaderProps> = async ({
    disabled,
    headCheck,
}) => {
    const cookieStore = cookies();

    const user = await getUser().catch((e: AxiosError) => {
        if (e.response?.status === 401) {
            redirect('/login');
        }
    });

    const organizations = await getOrganizations().catch((e) => e);

    const orgId = cookieStore.get('orgId') ?? organizations[0].id ?? 1;

    //const checkOrg = await headCheckPaths('orgs/', 'org-settings', +orgId);

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
                    <SettingsSvgContainer disabled={disabled} />
                    <HeaderInputSelect
                        disabled={disabled}
                        organizations={organizations as IOrganization[]}
                    />
                    <NotificationsContainer />
                    <HeaderDropdown userData={user as IUser} />
                </div>
            </div>
            <div className={scss.header_nav_tablet}>
                <HeaderDropdown userData={user as IUser} />
                <div
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                    className={scss.header_nav_icons}
                >
                    <NotificationsContainer />
                    <BurgerMenu
                        headCheck={headCheck}
                        organizations={organizations as IOrganization[]}
                    />
                </div>
            </div>
        </header>
    );
};
