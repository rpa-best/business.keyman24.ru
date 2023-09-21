import type { Metadata } from 'next';
import React from 'react';
import { montserrat } from 'font/montserrat';

import { Header } from 'app/(Main)/components/Header';
import { SideMenu } from 'app/(Main)/components/SideMenu';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'scss/utils.scss';
import 'scss/_reset.scss';
import scss from 'app/(Main)/MainPage.module.scss';
import { getOrganizations } from 'http/organizationApi';

export const metadata: Metadata = {
    title: 'Keyman24 - Business',
    description: 'Keyman24 - Business',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const organizations = await getOrganizations().catch((e) => e);

    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Header />
                <div
                    style={{
                        pointerEvents:
                            organizations.length === 0 ? 'none' : 'auto',
                    }}
                    className={scss.main_layout}
                >
                    <SideMenu />
                    <main className={scss.children_layout}>{children}</main>
                </div>
                <ToastContainer />
            </body>
        </html>
    );
}
