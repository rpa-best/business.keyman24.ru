import React, { useMemo } from 'react';
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
import { useModalStore } from 'store/modalVisibleStore';
import { AxiosError } from 'axios';
import { InputCheckbox } from 'components/UI/Inputs/InputCheckbox';
import revalidate from 'utils/revalidate';
import { Timezones } from 'app/(Main)/locations/timezones';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { warningToastConfig } from 'config/toastConfig';

import scss from './LocationsAction.module.scss';

export const LocationAction: React.FC<LocationActionProps> = ({
    location,
    formType,
    setLoading,
    organizations,
    loading,
    setTableData,
    permissions,
}) => {
    const path = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const onSubmit = (values: LocationFormValues) => {
        setLoading(true);
        const body: CreateLocationBody = {
            desc: values.desc,
            name: values.location,
            can_out_with_inventory: values?.canOutWithInventory,
            timezone: timezones[values.timezone.id].utc[0],
        };

        if (formType === 'create') {
            createLocation(body)
                .then((d) => {
                    revalidate(path);
                    setTableData((rows) => [...rows, d]);
                    setVisible(false);
                })
                .catch((e) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.status === 403) {
                            toast('Недостаточно прав', warningToastConfig);
                            return;
                        }
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            editLocation(location?.id as number, body)
                .then((loc) => {
                    revalidate(path);
                    setTableData((d) =>
                        d.map((elem) => {
                            if (elem.id === loc.id) {
                                return loc;
                            }
                            return elem;
                        })
                    );
                    setVisible(false);
                })
                .catch((e) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.status === 403) {
                            toast('Недостаточно прав', warningToastConfig);
                            return;
                        }
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const timezones = useMemo(() => {
        return Timezones.filter((el) => el.ru_names.length !== 0).map(
            (el, index) => ({
                ...el,
                name: `${el.text}, ${el.ru_names}`,
                id: index,
            })
        );
    }, []);

    const locationTimezone = useMemo(() => {
        const timezone = timezones.find((el) =>
            el.utc.find((el) => {
                if (location?.timezone) {
                    return el === location?.timezone;
                } else {
                    return (
                        el === Intl.DateTimeFormat().resolvedOptions().timeZone
                    );
                }
            })
        );
        const index = timezones.indexOf(timezone as any);

        return {
            name: `${timezone?.text}, ${timezone?.ru_names}`,
            id: index,
        };
    }, [location?.timezone, timezones]);

    const {
        values,
        touched,
        handleChange,
        handleBlur,
        isValid,
        errors,
        setFieldValue,
        setFieldTouched,
        handleSubmit,
    } = useFormik<LocationFormValues>({
        initialValues: {
            location: location?.name ?? '',
            desc: location?.desc ?? '',
            timezone: locationTimezone,
            canOutWithInventory: location?.canOutWithInventory ?? false,
        },
        enableReinitialize: true,
        validate: LocationsActionValidate,
        onSubmit,
    });

    return (
        <>
            <form onSubmit={handleSubmit} className={scss.edit_form_location}>
                <h2 className={scss.title}>
                    Локация /
                    {formType === 'create' ? ' Добавление' : ' Редактирование'}
                </h2>
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
                    <InputSelect
                        autoComplete="off"
                        label="Часовой пояс"
                        setFieldTouched={setFieldTouched}
                        listValues={timezones}
                        onChange={(tz) => {
                            setFieldValue('timezone', tz);
                        }}
                        handleError={
                            touched.timezone && (errors.timezone as string)
                        }
                        value={values.timezone.name}
                        name="timezone"
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
                <div className={scss.checkbox_wrapper}>
                    <InputCheckbox
                        name="canOutWithInventory"
                        label="Можно выходить с инвентарём"
                        value={values?.canOutWithInventory}
                        type="checkbox"
                        onChange={() =>
                            setFieldValue(
                                'canOutWithInventory',
                                !values.canOutWithInventory
                            )
                        }
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
                        permissions={permissions}
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
