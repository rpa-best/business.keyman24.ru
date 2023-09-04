import type { Metadata } from 'next';
import React from 'react';
import { montserrat } from 'font/montserrat';

import { Header } from 'app/(Main)/components/Header';
import { SideMenu } from 'app/(Main)/components/SideMenu';

import 'scss/utils.scss';
import 'scss/_reset.scss';
import scss from 'app/(Main)/MainPage.module.scss';

export const metadata: Metadata = {
    title: 'Keyman24 - Business',
    description: 'Keyman24 - Business',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Header />
                <div className={scss.main_layout}>
                    <SideMenu />
                    <main className={scss.children_layout}>{children}</main>
                </div>
            </body>
        </html>
    );
}
