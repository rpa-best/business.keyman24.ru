'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SettingsSvgContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Settings';
import { HeaderInputSelect } from 'app/(Main)/components/Header/components/InputSelect';
import { IOrganization } from 'store/types';
import Cookies from 'universal-cookie';
import { allowedPath } from 'http/userApi';

interface OrganizationProps {
    disabled: boolean;
    size?: 'pc' | 'tablet';
    organizations: IOrganization[];
}

const cookie = new Cookies();

export const Organization: React.FC<OrganizationProps> = ({
    disabled,
    organizations,
    size = 'tablet',
}) => {
    const [path, setPath] = useState(false);

    useEffect(() => {
        if (size === 'pc') {
            const orgId = cookie.get('orgId');
            const fetchData = allowedPath('service/subscription', orgId);
            fetchData.then((d) => setPath(d)).catch((e) => e);
        }
    }, []);

    if (!path && size === 'pc') {
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
