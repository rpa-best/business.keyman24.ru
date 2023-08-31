import { WorkerFormValuesType } from 'app/(Main)/workers/[id]/components/WorkerEditForm/types';

export const WorkerEditFormValidate = (values: WorkerFormValuesType) => {
    const errors: Partial<WorkerFormValuesType> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.username) {
        errors.username = 'Обязательное поле';
    }

    if (!values.phone) {
        errors.phone = 'Обязательное поле';
    }

    if (!values.password) {
        errors.password = 'Обязательное поле';
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
