'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SettingsSvgContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Settings';
import { HeaderInputSelect } from 'app/(Main)/components/Header/components/InputSelect';
import { IOrganization } from 'store/types';
import Cookies from 'universal-cookie';
import { useAllowedPath } from 'hooks/useDeniedPath';

interface OrganizationProps {
    disabled: boolean;
    allowedPaths?: string[];
    size?: 'pc' | 'tablet';
    organizations: IOrganization[];
}

const cookie = new Cookies();

export const Organization: React.FC<OrganizationProps> = ({
    disabled,
    organizations,
    size = 'tablet',
    allowedPaths,
}) => {
    const router = useRouter();

    const path = useAllowedPath('service/subscription', size);

    useEffect(() => {
        const orgId = cookie.get('orgId');
        if (!orgId) {
            cookie.set('orgId', organizations[0]?.id);
            router.refresh();
        }
    }, []);

    if (!path && size === 'pc') {
        return null;
    }

    if (allowedPaths && !allowedPaths?.includes('service/subscription')) {
        return null;
    }

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
