export function getObjValue(obj: any, path: string) {
    if (!path) return obj;
    const properties = path.split('.');
    return getObjValue(obj[properties.shift() as string], properties.join('.'));
}
