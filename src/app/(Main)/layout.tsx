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
import { cookies } from 'next/headers';
import { headCheckPaths } from 'http/userApi';
import { headCheckData } from 'app/(Main)/components/SideLinks/sidebarCheckAccess';

export const metadata: Metadata = {
    title: 'Keyman24 - Business',
    description: 'Keyman24 - Business',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const date = Date.now();
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const services = await getServices(+orgId).catch((e) => e);

    const disabled = services ? services.status === 'notActive' : false;

    const deniedLinksCheck = await Promise.all(
        headCheckData.map(async (elem) => {
            return await headCheckPaths(elem.head as string, elem.href, +orgId);
        })
    );

    console.log(Date.now() - date);

    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Header
                    services={services}
                    headCheck={deniedLinksCheck}
                    disabled={disabled}
                />
                <div className={scss.main_layout}>
                    <SideMenu
                        headCheck={deniedLinksCheck}
                        disabled={disabled}
                    />
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
