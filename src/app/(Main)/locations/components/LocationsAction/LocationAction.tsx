import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { CreateLocationBody } from 'http/types';
import { Input } from 'components/UI/Inputs/Input';
import { Button } from 'components/UI/Buttons/Button';
import {
    LocationActionProps,
    LocationFormValues,
} from 'app/(Main)/locations/components/LocationsAction/types';
import { LocationsActionValidate } from 'app/(Main)/locations/components/LocationsAction/LocationsAction.utils';
import { createLocation, editLocation } from 'http/locationsApi';
import { PickListsWrapper } from 'app/(Main)/locations/components/LocationsAction/components/PickListsWrapper';
import { useNotificationStore } from 'store/notificationStore';
import { useModalStore } from 'store/modalVisibleStore';
import revalidate from 'utils/revalidate';
import { errorToastOptions } from 'config/toastConfig';

import scss from './LocationsAction.module.scss';

export const LocationAction: React.FC<LocationActionProps> = ({
    location,
    formType,
    setLoading,
    organizations,
    loading,
    setTableData,
}) => {
    const path = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);

    const onSubmit = (values: LocationFormValues) => {
        setLoading(true);
        const body: CreateLocationBody = {
            desc: values.desc,
            name: values.location,
        };

        if (formType === 'create') {
            createLocation(body)
                .then((d) => {
                    revalidate(path);
                    setTableData((rows) => [...rows, d]);
                })
                .catch(() => {
                    toast('Ошибка', errorToastOptions);
                })
                .finally(() => {
                    setLoading(false);
                    setVisible(false);
                });
        } else {
            editLocation(location?.id as number, body)
                .then(() => {
                    revalidate(path);
                    setTableData((d) =>
                        d.map((elem) => {
                            if (elem.id === location.id) {
                                return {
                                    ...elem,
                                    desc: values.desc,
                                    name: values.location,
                                };
                            }
                            return elem;
                        })
                    );
                })
                .catch(() => {
                    toast('Ошибка', errorToastOptions);
                })
                .finally(() => {
                    setVisible(false);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (formType === 'edit') {
            setNoteVisible(false);
        }
    }, [setNoteVisible, formType]);

    const {
        values,
        touched,
        handleChange,
        handleBlur,
        isValid,
        errors,
        handleSubmit,
    } = useFormik<LocationFormValues>({
        initialValues: {
            location: location?.name ?? '',
            desc: location?.desc ?? '',
        },
        enableReinitialize: true,
        validate: LocationsActionValidate,
        onSubmit,
    });

    return (
        <>
            <form onSubmit={handleSubmit} className={scss.edit_form_location}>
                <h2 className={scss.title}>Рабочее место / Добавление</h2>
                <div className={scss.input}>
                    <Input
                        label="Название"
                        onBlur={handleBlur}
                        handleError={touched.location && errors.location}
                        value={values.location}
                        placeholder="Укажите название локации"
                        name="location"
                        onChange={handleChange}
                    />
                </div>
                <div className={scss.input}>
                    <Input
                        label="Описание"
                        needErrorLabel={false}
                        onBlur={handleBlur}
                        handleError={touched.desc && errors.desc}
                        value={values.desc}
                        placeholder="Укажите описание"
                        name="desc"
                        onChange={handleChange}
                    />
                </div>
                <div className={scss.button_wrapper}>
                    <Button
                        onClick={() => {}}
                        disabled={!isValid}
                        type="submit"
                    >
                        {formType === 'create' ? 'Добавить' : 'Сохранить'}
                    </Button>
                </div>
                {formType === 'edit' && (
                    <PickListsWrapper
                        loading={loading}
                        setLoading={setLoading}
                        locId={location.id}
                        organizations={organizations}
                    />
                )}
            </form>
        </>
    );
};
