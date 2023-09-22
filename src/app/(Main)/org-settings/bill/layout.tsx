import React from 'react';

import { Nav } from 'app/(Main)/org-settings/bill/components/Nav';
import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';
import { cookies } from 'next/headers';
import { getOrgById } from 'http/organizationApi';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value ?? 1;

    const org = await getOrgById(+id);

    return (
        <div
            style={{ marginBottom: '20px' }}
            className={scss.children_with_table}
        >
            <h2 className={scss.page_title_with_table}>{org.name}</h2>
            <Nav />
            {children}
        </div>
    );
}
