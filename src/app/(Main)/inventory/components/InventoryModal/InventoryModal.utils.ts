import { InventoryFormType } from 'app/(Main)/inventory/components/InventoryModal/types';

interface ErrorType extends Omit<InventoryFormType, 'type'> {
    type: string;
}

export const InventoryFormValidate = (values: InventoryFormType) => {
    const errors: Partial<ErrorType> = {};

    if (!values.type?.name) {
        errors.type = 'Обязательное поле';
    }

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.number) {
        errors.number = 'Обязательное поле';
    }

    return errors;
};
