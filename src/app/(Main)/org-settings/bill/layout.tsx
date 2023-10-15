import React from 'react';

import { Nav } from 'app/(Main)/org-settings/bill/components/Nav';

import scss from 'app/(Main)/org-settings/bill/Bill.module.scss';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={scss.custom_children}>
            <Nav />
            {children}
        </div>
    );
}
