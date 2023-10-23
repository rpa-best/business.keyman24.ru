import { useFormik } from 'formik';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { RowFormValidate } from './RowForm.utils';
import { FormValues } from './types';
import { Input } from 'components/UI/Inputs/Input';
import { RowFormProps } from 'app/(Main)/locations/types';
import { Button } from 'components/UI/Buttons/Button';
import { useNotificationStore } from 'store/notificationStore';

import scss from './RowForm.module.scss';

export const RowForm: React.FC<RowFormProps> = ({ setData }) => {
    const onSubmit = (values: FormValues) => {
        const newObj = [
            {
                id: uuidv4(),
                count: +values.count,
                category: values.room,
            },
        ];

        setData((data) => [...(data ?? []), ...newObj]);
    };

    const {
        values,
        handleChange,
        handleSubmit,
        handleBlur,
        isValid,
        errors,
        touched,
    } = useFormik<FormValues>({
        initialValues: {
            room: '',
            count: '',
        },
        validateOnMount: true,
        validate: RowFormValidate,
        onSubmit: async (values, { resetForm }) => {
            onSubmit(values);
            resetForm();
        },
    });

    return (
        <form onSubmit={handleSubmit} className={scss.form_wrapper}>
            <div className={scss.form}>
                <div className={scss.input_count}>
                    <Input
                        placeholder="Количество"
                        handleError={touched.count && errors.count}
                        onBlur={handleBlur}
                        style={{ width: '100%' }}
                        name="count"
                        value={values.count + ''}
                        onChange={handleChange}
                        type="number"
                    />
                </div>
                <div className={scss.input_name}>
                    <Input
                        handleError={touched.room && errors.room}
                        onBlur={handleBlur}
                        style={{ width: '100%' }}
                        name="room"
                        value={values.room}
                        onChange={handleChange}
                        placeholder="Наименование"
                    />
                </div>
            </div>
            <div className={scss.form_button}>
                <Button
                    disabled={touched.count && touched.room && !isValid}
                    onClick={() => {}}
                    type="submit"
                >
                    Добавить
                </Button>
            </div>
        </form>
    );
};
