import { useFormik } from 'formik';
import React from 'react';

import { EditValues } from 'app/(Main)/working-area/components/EditWorkingArea/types';
import { EditWorkingAreaProps } from 'app/(Main)/working-area/types';
import { Input } from 'UI/Inputs/Input';

import scss from './EditWorkingArea.module.scss';

export const EditWorkingArea: React.FC<EditWorkingAreaProps> = ({
    types,
    locations,
}) => {
    const { values, handleChange, handleSubmit } = useFormik<EditValues>({
        initialValues: {
            name: '',
            description: '',
            location: locations[0],
            type: types[0],
        },
        onSubmit: (values) => {},
    });

    return (
        <form onSubmit={handleSubmit} className={scss.edit_form}>
            <h2 className={scss.form_title}>Рабочее место / Добавление</h2>
            <Input
                value={values.name}
                placeholder="Укажите имя"
                name="name"
                onChange={handleChange}
            />

            <Input
                value={values.description}
                placeholder="Укажите описание"
                name="description"
                onChange={handleChange}
            />
        </form>
    );
};
