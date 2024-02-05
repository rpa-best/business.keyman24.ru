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
                {org.prime && (
                    <div className={scss.status_bar}>
                        <span>Прайм-Статус</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            width="16"
                            height="16"
                        >
                            <polygon
                                points="50,10 61.8,35 90,35 67,55 78.2,80 50,65 21.8,80 33,55 10,35 38.2,35"
                                fill="#31D79B"
                            />
                        </svg>
                    </div>
                )}
                <LayoutNav />
            </div>
            {children}
        </>
    );
}
