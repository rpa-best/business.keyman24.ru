import { LocationInfoWrapperValues } from 'app/(Main)/locations/edit/[id]/types';

export const LocationFormValidate = (values: LocationInfoWrapperValues) => {
    const errors: Partial<typeof values> = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    return errors;
};
