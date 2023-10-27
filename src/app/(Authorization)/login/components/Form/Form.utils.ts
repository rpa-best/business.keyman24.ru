import * as T from 'app/(Authorization)/login/components/Form/Form.types';
import {
    IPassFormTypes,
    IPinCodeFormTypes,
} from 'app/(Authorization)/login/components/Form/Form.types';

function checkStringForDigitsAndLetters(str: string) {
    const digitRegex = /[0-9]/;
    const letterRegex = /[a-zA-Z]/;

    // Проверяем, содержит ли строка и цифры, и буквы
    return digitRegex.test(str) && letterRegex.test(str);
}

function isEmpty(str: string[]) {
    return str.every((string) => !/\d/g.test(string));
}

export function fullFilled(str: string[]) {
    return str.every((el) => /\d/g.test(el));
}

export function LoginFormValidate(values: T.ILoginFormTypes) {
    const errors: T.IFormValidateErrors = {};

    if (!values.username) {
        errors.username = 'Укажите почту';
    }

    if (!values.password) {
        errors.password = 'Укажите пароль';
    }

    return errors;
}

export const CheckingPinFormUtils = (values: IPinCodeFormTypes) => {
    const errors: { code?: string } = {};

    if (isEmpty(values)) {
        errors.code = 'Укажите код';
    } else if (!fullFilled(values)) {
        errors.code = 'Не полный код';
    }

    return errors;
};

export const PassFormValidate = (values: IPassFormTypes) => {
    const errors: Partial<IPassFormTypes> = {};

    if (!values.password) {
        errors.password = 'Обязательное поле';
    } else if (!checkStringForDigitsAndLetters(values.password)) {
        errors.password = 'Пароль должен содержать буквы и цифры';
    } else if (values.password.length < 8) {
        errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (!values.confirmPassword) {
        errors.password = 'Обязательное поле';
    }

    if (values.confirmPassword !== values.password) {
        errors.password = 'Пароли не совпадают';
    }

    return errors;
};
