'use client';

import React from 'react';

import { Organization } from 'app/(Main)/components/Header/components/Organization';

import { IOrganization, IUser } from 'store/types';
import { HeaderDropdown } from 'app/(Main)/components/Header/components/Dropdown';
import { IServiceRate } from 'http/types';
import { useSocketNotificationConnect } from 'hooks/useSocketNotificationConnect';

import scss from 'app/(Main)/components/Header/Header.module.scss';

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
    return (
        <div className={scss.tools_wrapper}>
            <Organization
                size="pc"
                disabled={disabled}
                organizations={organizations}
            />
            <HeaderDropdown subs={subs} userData={user as IUser} />
        </div>
    );
};
