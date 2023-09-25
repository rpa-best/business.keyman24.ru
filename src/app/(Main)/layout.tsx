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
import { getOrganizations, getServices } from 'http/organizationApi';
import { Notification } from 'app/(Main)/components/Notification';

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

    const services = await getServices(organizations[0].id);

    const disabled = false;

    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Header disabled={disabled} />
                <div className={scss.main_layout}>
                    <SideMenu disabled={disabled} />
                    {disabled && <Notification status={services.status} />}
                    <main
                        style={{
                            pointerEvents: disabled ? 'none' : 'auto',
                        }}
                        className={scss.children_layout}
                    >
                        {children}
                    </main>
                </div>
                <ToastContainer />
            </body>
        </html>
    );
}
