import { FormValues } from 'app/(Main)/locations/components/RowForm/types';

export const RowFormValidate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.count) {
        errors.count = 'Введите количество';
    } else if (values.count.toString().indexOf('-') !== -1) {
        errors.count = 'Значение не может быть отрицательным';
    }

    if (!values.room) {
        errors.room = 'Укажите наименование';
    }

    return errors;
};
