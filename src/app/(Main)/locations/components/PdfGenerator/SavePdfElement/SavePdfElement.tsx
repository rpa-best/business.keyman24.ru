'use client';

import React from 'react';
import ReactPDF, { View, StyleSheet, Text, Image } from '@react-pdf/renderer';

import { generateBarcodeDataURL } from 'helpers/generateBarCodeImage';
import { IGeneratedKeys } from 'app/(Main)/locations/types';

import Font = ReactPDF.Font;

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

export const SavePdfElement: React.FC<IGeneratedKeys> = ({
    name,
    codeNumber,
    id,
}) => {
    const barcodeDataURL = generateBarcodeDataURL(codeNumber);

    return (
        <View style={styles.listItem}>
            <View style={styles.listItemDescription}>
                <Text style={styles.listItemField}>{id}</Text>
                <Text style={styles.listItemField}>{name}</Text>
            </View>
            <View style={styles.barcode}>
                <Image src={barcodeDataURL} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listItemDescription: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    listItemField: {
        fontSize: '26pt',
        fontFamily: 'Roboto',
    },
    barcode: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    barcodeText: {
        marginLeft: '50pt',
    },
});
