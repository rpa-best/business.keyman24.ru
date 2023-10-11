'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { createLocationObject, editLocationObject } from 'http/locationsApi';
import {
    ObjectFormModalProps,
    ObjectFormModalValues,
} from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/types';
import { ObjectFormValidate } from 'app/(Main)/locations/[locId]/objects/components/ObjectFormModal/ObjectFormModal.utils';
import { useModalStore } from 'store/modalVisibleStore';
import { useNotificationStore } from 'store/notificationStore';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import { Spinner } from 'components/Spinner';

import scss from './ObjectFormModal.module.scss';
import { LocationFormValues } from 'app/(Main)/locations/components/LocationsAction/types';
import revalidate from 'utils/revalidate';
import { usePathname, useRouter } from 'next/navigation';
import { router } from 'next/client';

export const ObjectFormModal: React.FC<ObjectFormModalProps> = ({
    locId,
    object,
    type,
    setObjects,
}) => {
    const router = useRouter();

    const pathname = usePathname();
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);

    const onSubmit = (values: ObjectFormModalValues) => {
        setLoading(true);
        const body = {
            desc: values.desc,
            name: values.name,
        };

        if (type === 'create') {
            createLocationObject(locId, body)
                .then((d) => {
                    revalidate(pathname);
                    setObjects((obj) => [...obj, d]);
                })
                .finally(() => {
                    setLoading(false);
                    setVisible(false);
                });
        } else {
            editLocationObject(locId, object?.id as number, body)
                .then(() => {
                    revalidate(pathname);
                    setObjects((obj) =>
                        obj.map((objects) => {
                            if (objects.id === object?.id) {
                                return {
                                    ...objects,
                                    name: values.name,
                                    desc: values.desc,
                                };
                            }
                            return objects;
                        })
                    );
                })
                .finally(() => {
                    setLoading(false);
                    setVisible(false);
                });
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
