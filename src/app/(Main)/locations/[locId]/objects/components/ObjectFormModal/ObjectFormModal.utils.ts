import { ObjectFormModalValues } from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/types';

export const ObjectFormValidate = (values: ObjectFormModalValues) => {
    const errors: Partial<typeof values> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    return errors;
};
