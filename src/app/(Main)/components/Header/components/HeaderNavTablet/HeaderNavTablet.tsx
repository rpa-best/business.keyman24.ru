'use client';

import React from 'react';

import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { IOrganization, IUser } from 'store/types';

import { BurgerMenu } from 'app/(Main)/components/Header/components/BurgerMenu';
import { IServiceRate } from 'http/types';
import { useSocketNotificationConnect } from 'hooks/useSocketNotificationConnect';
import { useResizeWidth } from 'hooks/useResizeWidth';

import scss from 'app/(Main)/components/Header/Header.module.scss';

interface HeaderNavTabletProps {
    subs: IServiceRate[];
    disabled: boolean;
    organizations: IOrganization[];
    user: IUser;
}

export const HeaderNavTablet: React.FC<HeaderNavTabletProps> = ({
    subs,
    disabled,
    user,
    organizations,
}) => {
    const { tabletBreak } = useResizeWidth();

    useSocketNotificationConnect(`ws/notification/`);

    return (
        <div className={scss.header_nav_tablet}>
            <HeaderDropdown subs={subs} userData={user} />
            <div
                style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                className={scss.header_nav_icons}
            >
                {tabletBreak && (
                    <>
                        <BurgerMenu
                            disabled={disabled}
                            organizations={organizations as IOrganization[]}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
