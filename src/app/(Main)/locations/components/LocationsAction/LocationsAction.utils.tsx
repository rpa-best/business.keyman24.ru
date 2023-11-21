import { LocationFormValues } from 'app/(Main)/locations/components/LocationsAction/types';

interface ErrorsType extends Partial<Omit<LocationFormValues, 'timezone'>> {
    timezone?: string;
}

export const LocationsActionValidate = (values: LocationFormValues) => {
    const errors: ErrorsType = {};

    if (!values.location) {
        errors.location = 'Обязательное поле';
    }

    if (!values.timezone) {
        errors.timezone = 'Обязательное поле';
    }

    return errors;
};
