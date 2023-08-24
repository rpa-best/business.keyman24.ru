export const generateRandomITF14Code = () => {
    const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let productNumber = '';
    for (let i = 0; i < 13; i++) {
        productNumber += getRandomNumber(0, 9).toString();
    }

    const luhnChecksum = (number: number) => {
        const digits = number.toString().split('').map(Number);
        let sum = 0;
        let alt = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            const curDigit = digits[i];
            if (alt) {
                const doubled = curDigit * 2;
                sum += doubled > 9 ? doubled - 9 : doubled;
            } else {
                sum += curDigit;
            }
            alt = !alt;
        }

        return (10 - (sum % 10)) % 10;
    };

    const checksum = luhnChecksum(+productNumber);

    const itf14Code = `${productNumber}${checksum}`;

    return itf14Code;
};