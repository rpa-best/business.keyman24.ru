function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

export const formatWorkerInfoData = (d: Date) => {
    return [
        padTo2Digits(d.getDate()),
        padTo2Digits(d.getMonth() + 1),
        d.getFullYear(),
    ].join('.');
};
