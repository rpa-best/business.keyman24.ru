import { TemporaryWorkerFormValuesType } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/types';

interface ErrorsType
    extends Partial<Omit<TemporaryWorkerFormValuesType, 'rangeDate'>> {
    rangeDate?: string;
}

export const TemporaryWorkerFormValidate = (
    values: TemporaryWorkerFormValuesType
) => {
    const errors: ErrorsType = {};

    if (!values.fullName) {
        errors.fullName = 'Обязательное поле';
    }

    return errors;
};
