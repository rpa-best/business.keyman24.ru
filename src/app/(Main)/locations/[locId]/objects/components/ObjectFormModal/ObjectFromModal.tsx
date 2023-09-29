'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { LocationInfoWrapperValues } from 'app/(Main)/locations/edit/[id]/types';
import { useRouter } from 'next/navigation';
import { createLocationObject, editLocationObject } from 'http/locationsApi';
import {
    ObjectFormModalProps,
    ObjectFormModalValues,
} from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/types';
import { ObjectFormValidate } from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/ObjectFormModal.utils';
import { useModalStore } from 'store/modalVisibleStore';
import { useNotificationStore } from 'store/notificationStore';

import scss from './ObjectFormModal.module.scss';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { Spinner } from 'components/Spinner';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';

export const ObjectFormModal: React.FC<ObjectFormModalProps> = ({
    locId,
    object,
    type,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = (values: LocationInfoWrapperValues) => {
        setLoading(true);
        const body = {
            desc: values.desc,
            name: values.name,
        };

        if (type === 'create') {
            createLocationObject(locId, body)
                .then(() => {
                    subAction(fields, 'Object', 1, 'add');
                    router.refresh();
                })
                .finally(() => {
                    setLoading(false);
                    setVisible(false);
                });
        } else {
            editLocationObject(locId, object?.id as number, body).finally(
                () => {
                    router.refresh();
                    setLoading(false);
                    setVisible(false);
                }
            );
        }
    };

    useEffect(() => {
        if (type === 'create') {
            setNoteVisible(true);
        }
        return () => {
            setNoteVisible(false);
        };
    }, [setNoteVisible, type]);

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
    } = useFormik<ObjectFormModalValues>({
        initialValues: {
            desc: object?.desc ?? '',
            name: object?.name ?? '',
        },
        onSubmit,
        validate: ObjectFormValidate,
    });

    return (
        <form onSubmit={handleSubmit} className={scss.location_card}>
            <h2 className={scss.card_title}>
                Объект / {type === 'create' ? 'создание' : 'редактирование'}
            </h2>
            <Input
                handleError={touched.name && errors.name}
                label="Наименование объекта"
                placeholder="Укажите наименование"
                value={values.name}
                onBlur={handleBlur}
                name="name"
                onChange={handleChange}
            />
            <Input
                label="Описание объекта"
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
