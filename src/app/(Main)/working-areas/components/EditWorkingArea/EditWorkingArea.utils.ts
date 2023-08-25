import { WorkAreaValues } from 'app/(Main)/working-areas/components/EditWorkingArea/types';

interface ErrorsType
    extends Partial<Omit<WorkAreaValues, 'type' | 'location'>> {
    type?: string;
    location?: string;
}

export const ValidateAddWorkingArea = (values: WorkAreaValues) => {
    const errors: ErrorsType = {};

    if (!values.name) {
        errors.name = 'Обязательное поле';
    }

    if (!values.type.name) {
        errors.type = 'Обязательное поле';
    }

    if (!values.location.name) {
        errors.location = 'Обязательное поле';
    }

    return errors;
};
