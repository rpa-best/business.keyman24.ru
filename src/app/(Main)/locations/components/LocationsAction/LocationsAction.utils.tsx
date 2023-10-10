import { LocationFormValues } from 'app/(Main)/locations/components/LocationsAction/types';

export const LocationsActionValidate = (values: LocationFormValues) => {
    const errors: Partial<LocationFormValues> = {};

    if (!values.location) {
        errors.location = 'Обязательное поле';
    }

    return errors;
};
