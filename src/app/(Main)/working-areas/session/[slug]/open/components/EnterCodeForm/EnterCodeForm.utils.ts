import { EnterCodeFormValues } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';

export const CodeFormValidate = (values: EnterCodeFormValues) => {
    const errors: Partial<EnterCodeFormValues> = {};

    if (!values.code) {
        errors.code = 'Введите код';
    } else if (values.code.toString().length > 12) {
        errors.code = 'Длина не может быть больше 12';
    }

    return errors;
};
