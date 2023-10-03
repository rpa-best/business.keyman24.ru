'use client';
import React from 'react';

import { Button } from 'components/UI/Buttons/Button';

import Link from 'next/link';

export const PaymentButton = () => {
    return (
        <Link
            href="http://localhost:3000/pdf/pdf.pdf"
            download="pdf"
            style={{ width: 'max-content' }}
        >
            <Button onClick={() => {}} type="button">
                Пополнить
            </Button>
        </Link>
    );
};
