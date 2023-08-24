import { camelCase } from 'change-case';
import { isObject } from 'utils/isObject';

/* eslint-disable */
export const snakeToCamelCaseDeep = (target: any): void => {
    if (Array.isArray(target)) {
        target.forEach((t) => snakeToCamelCaseDeep(t));
    }
    if (isObject(target)) {
        Object.keys(target).forEach((key) => {
            if (isObject(target[key]) || Array.isArray(target[key])) {
                snakeToCamelCaseDeep(target[key]);
            }

            if (key.includes('_')) {
                target[camelCase(key)] = target[key];
                delete target[key];
            }
        });
    }
};
