import React from 'react';

import { Nav } from 'app/(Main)/org-settings/bill/components/Nav';
import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';
import { cookies, headers } from 'next/headers';
import { getOrgById } from 'http/organizationApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const headersList = headers();
    const fullUrl = headersList.get('referer') || '';

    const id = cookieStore.get('orgId')?.value as string;

    const org = await getOrgById(+id);

    return (
        <div
            style={{ marginBottom: '20px' }}
            className={scss.children_with_table}
        >
            <div className={scss.page_title_with_table_back_button}>
                <h1>{org.name}</h1>
                <BackButton
                    skipTwoWords={
                        fullUrl ===
                        'http://localhost:3000/org-settings/bill/bill-history'
                    }
                >
                    Назад
                </BackButton>
            </div>
            <Nav />
            {children}
        </div>
    );
}
