export function getObjValue(obj: any, path: string) {
    if (!path) return obj;
    const properties = path.split('.');
    if (!obj[0]) {
        return;
    }
    return getObjValue(obj[properties.shift() as string], properties.join('.'));
}
