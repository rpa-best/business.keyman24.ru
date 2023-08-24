import { FormValues } from 'app/(Main)/keys/components/RowForm/types';

export const RowFormValidate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.count) {
        errors.count = 'Введите количество';
    }
    if (!values.room) {
        errors.room = 'Укажите наименование';
    }

    return errors;
};
