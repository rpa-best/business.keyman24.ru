import type { Metadata } from 'next';
import React from 'react';
import { ToastContainer } from 'react-toastify';

import { montserrat } from 'font/montserrat';

import 'react-toastify/dist/ReactToastify.css';
import 'scss/utils.scss';
import 'scss/_reset.scss';

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
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
