'use client';

import React from 'react';

import { SettingsSvgContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Settings';
import { HeaderInputSelect } from 'app/(Main)/components/Header/components/InputSelect';
import { IOrganization } from 'store/types';

interface OrganizationProps {
    disabled: boolean;
    organizations: IOrganization[];
}

export const Organization: React.FC<OrganizationProps> = ({
    disabled,
    organizations,
}) => {
    return (
        <>
            <SettingsSvgContainer disabled={disabled} />
            <HeaderInputSelect
                disabled={disabled}
                organizations={organizations}
            />
        </>
    );
};
