import { DefaultElem } from 'components/PickList/types';

export function sortArr(arr: DefaultElem[]) {
    if (arr?.length === 0 || !arr) {
        return [];
    }
    return arr.sort((a, b) => {
        // Сравниваем значения поля "name" без учета регистра
        if (a.name && b.name) {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        }
        return 1;
    });
}
