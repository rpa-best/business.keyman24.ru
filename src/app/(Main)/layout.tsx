import type { Metadata } from 'next';
import React from 'react';
import { cookies } from 'next/headers';
import { montserrat } from 'font/montserrat';

import { Header } from 'app/(Main)/components/Header';
import { SideMenu } from 'app/(Main)/components/SideMenu';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'scss/utils.scss';
import 'scss/_reset.scss';
import { getServices } from 'http/organizationApi';
import { Notification } from 'app/(Main)/components/Notification';

import scss from 'app/(Main)/MainPage.module.scss';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { IService } from 'http/types';

export const metadata: Metadata = {
    title: 'Keyman24 - Business',
    description: 'Keyman24 - Business',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const services = (await getServices(+orgId).catch((e) => {
        if (e instanceof AxiosError) {
            if (e.response?.status === 401) {
                redirect('/login');
            }
        }
    })) as IService;

    const disabled = services ? services?.status === 'notActive' : false;

    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Header services={services} disabled={disabled} />
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
