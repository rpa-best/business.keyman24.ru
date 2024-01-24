import { AddWorkerFormTypes } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/AddWorkerDocumentForm/types';

interface ErrorsType extends Partial<Omit<AddWorkerFormTypes, 'dateTo'>> {
    dateTo?: string;
}

export const AddWorkerDocumentFormValidate = (values: AddWorkerFormTypes) => {
    const errors: ErrorsType = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.dateTo) {
        errors.dateTo = 'Обязательное поле';
    }

    return errors;
};
