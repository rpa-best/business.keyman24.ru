import { useFormik } from 'formik';
import React, { useState } from 'react';

import { PermFormValues } from 'app/(Main)/permission-group/components/PermModalForm/types';
import { PermFormValidate } from 'app/(Main)/permission-group/components/PermModalForm/PermModalForm.utils';
import { IFormProps } from 'app/(Main)/permission-group/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { Button } from 'components/UI/Buttons/Button';
import { CreateGroupPermBody, ILevel } from 'http/types';
import { createGroupPerm, editGroupPerm } from 'http/permissionsApi';
import { PermissionPickList } from 'app/(Main)/permission-group/components/PermissionPickList';
import { useModalStore } from 'store/modalVisibleStore';
import { Input } from 'components/UI/Inputs/Input';
import { usePathname } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { AdminPermList } from 'app/(Main)/permission-group/components/AdminPermList';
import revalidate from 'utils/revalidate';

import scss from 'app/(Main)/permission-group/PermGroup.module.scss';

export const PermModalForm: React.FC<IFormProps> = ({
    level,
    formType,
    selectedPerm,
    setTableData,
}) => {
    const path = usePathname();
    const [loading, setLoading] = useState(false);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const adminPermission = !selectedPerm?.org;
    const onSubmit = async (values: PermFormValues) => {
        setLoading(true);
        const body: CreateGroupPermBody = {
            name: values.name,
            level: values.level?.id as number,
        };
        if (formType === 'create') {
            await createGroupPerm(body)
                .then((d) => {
                    revalidate(path);
                    const newPerm = {
                        ...d,
                        level: {
                            id: values.level?.id as number,
                            name: values.level?.name as string,
                        },
                        levelDesc: values.level?.name as string,
                    };
                    setTableData((data) => [...data, newPerm]);
                    setVisible(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            await editGroupPerm(selectedPerm?.id as number, body)
                .then(() => {
                    setVisible(false);
                    revalidate(path);
                    setTableData((data) => {
                        return data.map((el) => {
                            if (el.id === (selectedPerm?.id as number)) {
                                return {
                                    ...el,
                                    name: values.name,
                                    level: values.level as ILevel,
                                    levelDesc: values.level?.name as string,
                                };
                            }
                            return el;
                        });
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const {
        values,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        touched,
    } = useFormik<PermFormValues>({
        initialValues: {
            name: selectedPerm?.name ?? '',
            level: selectedPerm?.level ?? undefined,
        },
        enableReinitialize: true,
        validate: PermFormValidate,
        onSubmit,
    });

    return (
        <div className={scss.form_layout}>
            <h2 className={scss.form_title}>
                {adminPermission && formType === 'edit'
                    ? 'Группа прав доступа'
                    : 'Группа прав доступа / добавление'}
            </h2>
            <form className={scss.form} onSubmit={handleSubmit}>
                <div
                    style={{
                        marginBottom:
                            adminPermission && formType === 'edit'
                                ? '10px'
                                : undefined,
                    }}
                >
                    <Input
                        value={values.name}
                        disabled={adminPermission && formType === 'edit'}
                        name="name"
                        placeholder="Укажите имя"
                        handleError={touched.name && errors.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                {!adminPermission ||
                    (formType === 'create' && (
                        <div className={scss.select_wrapper}>
                            <InputSelect
                                setFieldTouched={setFieldTouched}
                                listValues={level}
                                autoComplete="off"
                                onChange={(level) =>
                                    setFieldValue('level', level)
                                }
                                placeholder="Укажите уровень"
                                handleError={touched.level && errors.level}
                                value={values.level?.name as string}
                                name="level"
                            />
                        </div>
                    ))}
                {!adminPermission && (
                    <Button
                        disabled={!isValid}
                        onClick={() => {}}
                        type="submit"
                    >
                        {formType === 'create' ? 'Добавить' : 'Сохранить'}
                    </Button>
                )}
                {formType === 'create' && (
                    <Button
                        disabled={!isValid}
                        onClick={() => {}}
                        type="submit"
                    >
                        Добавить
                    </Button>
                )}
            </form>
            {!adminPermission && formType === 'edit' && (
                <div className={scss.permission_pick_list}>
                    <PermissionPickList
                        levelId={values.level?.id as number}
                        id={selectedPerm?.id}
                        groupId={selectedPerm?.id as number}
                    />
                </div>
            )}
            {adminPermission && formType === 'edit' && (
                <AdminPermList
                    id={selectedPerm?.id as number}
                    levelId={values.level?.id as number}
                />
            )}
            {loading && <Spinner />}
        </div>
    );
};
