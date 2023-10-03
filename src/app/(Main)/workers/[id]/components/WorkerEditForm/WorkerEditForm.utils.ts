import { WorkerFormValuesType } from 'app/(Main)/workers/[id]/components/WorkerEditForm/types';

const emailCheck = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/gi;

function checkStringForDigitsAndLetters(str: string) {
    const digitRegex = /[0-9]/;
    const letterRegex = /[a-zA-Z]/;

    // Проверяем, содержит ли строка и цифры, и буквы
    return digitRegex.test(str) && letterRegex.test(str);
}

export const WorkerCreateFormValidate = (values: WorkerFormValuesType) => {
    const errors: Partial<WorkerFormValuesType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values?.username?.match(emailCheck)?.length && values.username) {
        errors.username = 'некорректный email';
    }

    if (!values.phone.match(/\(9..\)/)?.length) {
        errors.phone = 'поддерживаются номера с +79...';
    } else if (!values.phone.match(/\d$/)?.length) {
        errors.phone = 'неверный формат номера';
    }

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

export const WorkerEditFormValidate = (values: WorkerFormValuesType) => {
    const errors: Partial<WorkerFormValuesType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values?.username?.match(emailCheck)?.length && values.username) {
        errors.username = 'некорректный email';
    }

    if (!values.phone.match(/\(9..\)/)?.length) {
        errors.phone = 'поддерживаются номера с +79...';
    } else if (!values.phone.match(/\d$/)?.length) {
        errors.phone = 'неверный формат номера';
    }

    return errors;
};
