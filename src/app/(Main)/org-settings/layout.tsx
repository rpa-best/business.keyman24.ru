import React from 'react';

import { cookies } from 'next/headers';
import { getOrgById } from 'http/organizationApi';
import { LayoutNav } from 'app/(Main)/org-settings/components/LayoutNav';

import scss from './OrganizationSettings.module.scss';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value as string;

    const org = await getOrgById(+id);

    return (
        <>
            <div className={scss.default_wrapper}>
                <h2 className={scss.title}>{org.name}</h2>
                <LayoutNav />
            </div>
            {children}
        </>
    );
}
