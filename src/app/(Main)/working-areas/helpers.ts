export const getParamsId = (str: string) => {
    return str.slice(str.indexOf('-') + 1);
};

export const getParamsType = (str: string) => {
    return str.slice(0, str.indexOf('-'));
};
