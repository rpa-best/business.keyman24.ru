'use client';

import React, { useState } from 'react';

import { useFormik } from 'formik';
import {
    LocationInfoWrapperProps,
    LocationInfoWrapperValues,
} from 'app/(Main)/locations/edit/[id]/types';
import { LocationFormValidate } from 'app/(Main)/locations/components/LocationInfoWrapper/Form.utils';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { CreateLocationBody } from 'http/types';
import { useRouter } from 'next/navigation';
import { createLocation, editLocation } from 'http/locationsApi';
import { Spinner } from 'components/Spinner';

import scss from 'app/(Main)/locations/components/LocationInfoWrapper/LocationInfoWrapper.module.scss';

export const LocationInfoWrapper: React.FC<LocationInfoWrapperProps> = ({
    location,
    type,
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = (values: LocationInfoWrapperValues) => {
        setLoading(true);
        const body: CreateLocationBody = {
            desc: values.desc,
            name: values.name,
        };

        if (type === 'create') {
            createLocation(body).finally(() => {
                router.refresh();
                setLoading(false);
                router.push('/locations');
            });
        } else {
            editLocation(location?.id as number, body).finally(() => {
                router.refresh();
                setLoading(false);
            });
        }
    };

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
    } = useFormik<LocationInfoWrapperValues>({
        initialValues: {
            desc: location?.desc ?? '',
            name: location?.name ?? '',
        },
        onSubmit,
        validate: LocationFormValidate,
    });

    return (
        <form onSubmit={handleSubmit} className={scss.location_card}>
            <h2 className={scss.card_title}>Локация / редактирование</h2>
            <Input
                handleError={touched.name && errors.name}
                label="Наименование локации"
                placeholder="Укажите наименование"
                value={values.name}
                onBlur={handleBlur}
                name="name"
                onChange={handleChange}
            />
            <Input
                label="Описание локации"
                onBlur={handleBlur}
                placeholder="Укажите описание"
                value={values.desc}
                name="desc"
                onChange={handleChange}
            />
            <div className={scss.form_button}>
                <Button disabled={!isValid} onClick={() => {}} type="submit">
                    {type === 'create' ? 'Добавить' : 'Сохранить'}
                </Button>
            </div>
            {loading && <Spinner />}
        </form>
    );
};