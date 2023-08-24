import * as T from 'app/(Authorization)/login/components/Form/Form.types';

export function FormValidate(values: T.IFormTypes) {
    const errors: T.IFormValidateErrors = {};

    if (!values.username) {
        errors.username = 'Укажите логин';
    }

    if (!values.password) {
        errors.password = 'Укажите пароль';
    }

    return errors;
}
