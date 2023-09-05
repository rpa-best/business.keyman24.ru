import { InventoryFormType } from 'app/(Main)/inventory/components/InventoryModal/types';

interface ErrorType extends InventoryFormType {}

export const InventoryFormValidate = (values: InventoryFormType) => {
    const errors: Partial<ErrorType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    /*    if (!values.number) {
        errors.number = 'Обязательное поле';
    }*/

    return errors;
};
