'use client';

import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';

import { SavePdfElement } from 'app/(Main)/locations/components/PdfGenerator/SavePdfElement';

interface PdfGeneratorProps {
    data: { id: number; name: string; codeNumber: string }[];
}

export const PdfGenerator: React.FC<PdfGeneratorProps> = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {data.map((item, index) => (
                    <SavePdfElement key={index} {...item} />
                ))}
            </Page>
        </Document>
    );
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFF',
    },
});
