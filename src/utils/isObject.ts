/* eslint-disable */
export const isObject = (target: any): boolean =>
    Object.prototype.toString.call(target).slice(8, -1).toLowerCase() ===
    'object';
