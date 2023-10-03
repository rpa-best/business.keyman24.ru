import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { WorkAreaValues } from 'app/(Main)/working-areas/components/EditWorkingArea/types';
import { EditWorkingAreaProps } from 'app/(Main)/working-areas/types';
import { Input } from 'components/UI/Inputs/Input';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { CreateWorkingAreaProp, ILocation, IType } from 'http/types';
import { Button } from 'components/UI/Buttons/Button';
import {
    fetchAreasData,
    ValidateAddWorkingArea,
} from 'app/(Main)/working-areas/components/EditWorkingArea/EditWorkingArea.utils';
import { useModalStore } from 'store/modalVisibleStore';
import { createWorkingArea, patchWorkingArea } from 'http/workingAreaApi';
import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';
import { AreaPickList } from 'app/(Main)/working-areas/components/AreasPickList/AreasPickList';
import { useNotificationStore } from 'store/notificationStore';

import scss from './EditWorkingArea.module.scss';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';

export const EditWorkingArea: React.FC<EditWorkingAreaProps> = ({
    formType,
    types,
    locations,
    editableArea,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [setNoteVisible] = useNotificationStore((state) => [
        state.setVisible,
    ]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const router = useRouter();

    const onSubmit = (values: WorkAreaValues) => {
        const body: CreateWorkingAreaProp = {
            name: values.name,
            type: values.type.slug,
            location: values.location.id,
            deleted: false,
            desc: values.description,
        };
        if (formType === 'create') {
            createWorkingArea(body)
                .then(() => {
                    subAction(fields, 'WorkingArea', 1, 'add');
                    router.refresh();
                })
                .finally(() => {
                    setNoteVisible(false);
                    setVisible(false);
                });
        } else {
            patchWorkingArea(body, editableArea?.id as number)
                .then(() => {
                    router.refresh();
                })
                .finally(() => {
                    setVisible(false);
                });
        }
    };

    useEffect(() => {
        if (formType === 'create') {
            setNoteVisible(true);
        }
        return () => {
            setNoteVisible(false);
        };
    }, [setNoteVisible, formType]);

    const {
        values,
        touched,
        handleChange,
        handleBlur,
        isValid,
        setFieldTouched,
        errors,
        setFieldValue,
        handleSubmit,
    } = useFormik<WorkAreaValues>({
        initialValues: {
            name: editableArea?.name ?? '',
            description: editableArea?.desc ?? '',
            location: editableArea?.location ?? { ...locations[0], name: '' },
            type: editableArea?.type ?? { ...types[0], name: '' },
        },
        enableReinitialize: true,
        validate: ValidateAddWorkingArea,
        onSubmit,
    });

    return (
        <>
            <form onSubmit={handleSubmit} className={scss.edit_form}>
                <h2 className={scss.form_title}>Рабочее место / Добавление</h2>
                <Input
                    onBlur={handleBlur}
                    handleError={touched.name && errors.name}
                    value={values.name}
                    placeholder="Укажите название рабочего места"
                    name="name"
                    onChange={handleChange}
                />

                <Input
                    onBlur={handleBlur}
                    handleError={touched.description && errors.description}
                    value={values.description}
                    placeholder="Укажите описание"
                    name="description"
                    onChange={handleChange}
                />
                <div style={{ position: 'relative' }}>
                    <InputSelect
                        setFieldTouched={setFieldTouched}
                        autoComplete="off"
                        placeholder="Укажите локацию"
                        listValues={locations}
                        value={values.location.name}
                        handleError={
                            touched.location && (errors.location as string)
                        }
                        name="location"
                        onChange={(location: ILocation) => {
                            setFieldValue('location', location);
                        }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <InputSelect
                        setFieldTouched={setFieldTouched}
                        autoComplete="off"
                        handleError={touched.type && (errors.type as string)}
                        placeholder="Укажите тип"
                        listValues={types}
                        onChange={(type: IType) => {
                            setFieldValue('type', type);
                        }}
                        value={values.type.name}
                        name="type"
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
                    <AreaPickList areaId={editableArea?.id as number} />
                )}
            </form>
        </>
    );
};
