'use client';

import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';

import { IGeneratedKeys } from 'app/(Main)/keys/types';
import { SavePdfElement } from 'app/(Main)/keys/components/PdfGenerator/SavePdfElement/SavePdfElement';

interface PdfGeneratorProps {
    data: IGeneratedKeys[];
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
