import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import { PermFormValues } from 'app/(Main)/permission-group/components/PermModalForm/types';
import { PermFormValidate } from 'app/(Main)/permission-group/components/PermModalForm/PermModalForm.utils';
import { IFormProps } from 'app/(Main)/permission-group/types';
import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { Button } from 'components/UI/Buttons/Button';
import { CreateGroupPermBody } from 'http/types';
import { createGroupPerm, editGroupPerm } from 'http/permissionsApi';
import { PermissionPickList } from 'app/(Main)/permission-group/components/PermissionPickList';
import { fetchData } from 'app/(Main)/permission-group/components/PermModalForm/fetchData';
import { useModalStore } from 'store/modalVisibleStore';
import { Input } from 'components/UI/Inputs/Input';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';
import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';

import scss from 'app/(Main)/permission-group/PermGroup.module.scss';

export const PermModalForm: React.FC<IFormProps> = ({
    level,
    formType,
    selectedPerm,
}) => {
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const router = useRouter();
    const onSubmit = async (values: PermFormValues) => {
        setLoading(true);
        const body: CreateGroupPermBody = {
            name: values.name,
            level: values.level?.id as number,
        };
        if (formType === 'create') {
            await createGroupPerm(body).finally(() => {
                router.refresh();
                setLoading(false);
                setVisible(false);
            });
        } else {
            await editGroupPerm(selectedPerm?.id as number, body).finally(
                () => {
                    router.refresh();
                    setLoading(false);
                    setVisible(false);
                }
            );
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

    const [source, setSource] = useState<CustomGroupDefaultElem[]>([]);
    const [target, setTarget] = useState<CustomGroupDefaultElem[]>([]);

    useEffect(() => {
        if (formType === 'edit') {
            fetchData(
                selectedPerm?.id as number,
                values.level?.name as string
            ).then((d) => {
                setSource(d.src as []);
                setTarget(d.trg as []);
            });
        }
    }, [formType, selectedPerm?.id, refresh, values.level?.name]);

    return (
        <div className={scss.form_layout}>
            <h2 className={scss.form_title}>
                Группа прав доступа / добавление
            </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <Input
                        value={values.name}
                        name="name"
                        placeholder="Укажите имя"
                        handleError={touched.name && errors.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
                <div className={scss.select_wrapper}>
                    <InputSelect
                        setFieldTouched={setFieldTouched}
                        listValues={level}
                        autoComplete="off"
                        onChange={(level) => setFieldValue('level', level)}
                        placeholder="Укажите уровень"
                        handleError={touched.level && errors.level}
                        value={values.level?.name as string}
                        name="level"
                    />
                </div>
                <Button disabled={!isValid} onClick={() => {}} type="submit">
                    {formType === 'create' ? 'Добавить' : 'Сохранить'}
                </Button>
            </form>
            {formType === 'edit' && (
                <PermissionPickList
                    setRefresh={setRefresh}
                    source={source}
                    target={target}
                    groupId={selectedPerm?.id as number}
                />
            )}
            {loading && <Spinner />}
        </div>
    );
};
