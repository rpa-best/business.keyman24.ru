'use client';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PaymentPdf = () => {
    const pdfUrl = 'http://localhost:3000/pdf/pdf.pdf';

    return (
        <Document file={pdfUrl}>
            <Page pageNumber={1} />
        </Document>
    );
};
