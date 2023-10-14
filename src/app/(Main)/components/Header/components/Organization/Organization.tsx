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
    organizations: IOrganization[];
}

const cookie = new Cookies();

export const Organization: React.FC<OrganizationProps> = ({
    disabled,
    organizations,
}) => {
    const router = useRouter();
    const [path, setPath] = useState<boolean>();

    useEffect(() => {
        const orgId = cookie.get('orgId');
        if (!orgId) {
            cookie.set('orgId', organizations[0]?.id);
            router.refresh();
        }
    }, []);

    useEffect(() => {
        const orgId = cookie.get('orgId');
        allowedPath('service/subscription', orgId)
            .then((d) => {
                setPath(d);
            })
            .catch((e) => e);
    }, []);

    if (!path) {
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
