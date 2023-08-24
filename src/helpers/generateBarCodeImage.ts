import JsBarcode from 'jsbarcode';

export const generateBarcodeDataURL = (itf14Code: string) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, itf14Code, {
        format: 'ITF',
        lineColor: '#000000', // Цвет линий
        width: 2, // Ширина линий
        height: 100, // Высота штрихкода
        displayValue: true,
    });
    return canvas.toDataURL('image/png');
};
