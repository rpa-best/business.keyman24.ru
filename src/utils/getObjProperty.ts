export const getObjValue = (obj: any, path: string) => {
    return path
        .split('.')
        .reduce(
            (acc, key) =>
                acc && acc[key] !== undefined ? acc[key] : undefined,
            obj
        );
};
