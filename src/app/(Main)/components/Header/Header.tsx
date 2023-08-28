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
import { getUser } from 'http/userApi';

import scss from './Header.module.scss';

export const Header = async () => {
    const user = await getUser().catch((e: AxiosError) => {
        if (e.response?.status === 401) {
            redirect('/login');
        }
    });

    const organizations = await getOrganizations().catch((e) => e);

    return (
        <div className={scss.header_layout}>
            <div className={scss.header_nav}>
                <Link className={scss.title_wrapper} href="/">
                    <h2 className={scss.title}>KeyMan24</h2>
                    <span className={scss.separator} />
                    <h2 className={scss.title_second}>Business</h2>
                </Link>
                <div className={scss.tools_wrapper}>
                    <SettingsSvgContainer />
                    <HeaderInputSelect
                        organizations={organizations as IOrganization[]}
                    />
                    <NotificationsContainer />
                    <HeaderDropdown userData={user as IUser} />
                </div>
            </div>
            <div className={scss.header_nav_tablet}>
                <HeaderDropdown userData={user as IUser} />
                <div className={scss.header_nav_icons}>
                    <NotificationsContainer />
                    <BurgerMenu
                        organizations={organizations as IOrganization[]}
                    />
                </div>
            </div>
        </div>
    );
};
