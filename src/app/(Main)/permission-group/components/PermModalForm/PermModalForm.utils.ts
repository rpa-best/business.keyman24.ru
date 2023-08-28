import { PermFormValues } from 'app/(Main)/permission-group/components/PermModalForm/types';

interface ErrorType extends Omit<PermFormValues, 'level'> {
    level: string;
}

export const PermFormValidate = (values: PermFormValues) => {
    const errors: Partial<ErrorType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.level?.name) {
        errors.level = 'Обязательное поле';
    }

    return errors;
};
