'use client';

import React from 'react';

import { Organization } from 'app/(Main)/components/Header/components/Organization';
import { NotificationsContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Notifications';
import { IOrganization, IUser } from 'store/types';
import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { IServiceRate } from 'http/types';

import scss from 'app/(Main)/components/Header/Header.module.scss';
import { useResizeWidth } from 'hooks/useResizeWidth';

interface ToolsProps {
    disabled: boolean;
    organizations: IOrganization[];
    subs: IServiceRate[];
    user: IUser;
}

export const Tools: React.FC<ToolsProps> = ({
    subs,
    disabled,
    user,
    organizations,
}) => {
    const { tabletBreak } = useResizeWidth();

    return (
        <div className={scss.tools_wrapper}>
            <Organization
                size="pc"
                disabled={disabled}
                organizations={organizations}
            />
            {!tabletBreak && <NotificationsContainer user={user as IUser} />}
            <HeaderDropdown subs={subs} userData={user as IUser} />
        </div>
    );
};
