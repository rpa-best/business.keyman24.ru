import React, { useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';

import { useFormik } from 'formik';
import {
    EnterCodeFormProps,
    EnterCodeFormValues,
} from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';
import { CodeFormValidate } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/EnterCodeForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { Input } from 'components/UI/Inputs/Input';
import { sendSessionAction } from 'http/workingAreaApi';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import revalidate from 'utils/revalidate';

import scss from './EnterCodeFOrm.module.scss';
import { successToastConfig } from 'config/toastConfig';
import { getParamsType } from 'app/(Main)/working-areas/helpers';
import { ModifiedRegisterLog } from 'app/(Main)/working-areas/session/[slug]/open/types';

export const EnterCodeForm: React.FC<EnterCodeFormProps> = ({
    worker,
    areaId,
    type,
    setSessionLog,
    sessionId,
    needWorker = true,
}) => {
    const path = usePathname();
    const params = useParams();
    const slug = getParamsType(params.slug);
    const onSubmit = async (values: EnterCodeFormValues) => {
        let body = null;
        if (worker?.id) {
            body = {
                session: +sessionId,
                worker: +worker.id,
                barcode: values.code,
            };
        } else {
            body = {
                session: +sessionId,
                barcode: values.code,
            };
        }

        await sendSessionAction(areaId, sessionId, body)
            .then((d) => {
                let newLog:
                    | ModifiedRegisterLog
                    | Omit<ModifiedRegisterLog, 'workerName'>;
                let mode: string;
                if (slug === 'register_inventory') {
                    mode = d.mode ? 'Зарегестрировано' : 'Сдано';
                    newLog = {
                        ...d,
                        modeName: mode,
                        inventoryName: `${d?.inventory?.id} ${d?.inventory?.name}`,
                    };
                } else {
                    const inventoryName =
                        type === 'keys'
                            ? ` ${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.objectArea.name}`
                            : `${d?.inventory?.id} ${d?.inventory?.name} ${d.inventory.location.name}`;
                    mode = d.mode ? 'Выдан' : 'Сдан';
                    newLog = {
                        ...d,
                        workerName: d.worker.name,
                        modeName: mode,
                        inventoryName,
                    };
                }
                if (slug === 'register_inventory') {
                    revalidate('/inventory');
                }
                revalidate(path);
                setSessionLog((log) => [newLog, ...log]);
                toast('Успешно', successToastConfig);
            })
            .catch((e: AxiosError) => {
                // @ts-ignore
                if (e.response.data.error[0].slug === 'invalid_barcode') {
                    errors.code = 'Такого кода не существует';
                    return;
                }
                if (
                    // @ts-ignore
                    e.response.data.error[0].slug ===
                    'inventory_not_given_to_this_worker'
                ) {
                    errors.code = 'У этого работника нет такого инвентаря';
                }

                if (
                    // @ts-ignore
                    e.response.data.error[0].slug ===
                    'inventory_not_registered_in_location'
                ) {
                    errors.code = 'Этот инвентарь не зарегестрирован в локации';
                }
                if (
                    // @ts-ignore
                    e.response.data.error[0].slug ===
                    'not_support_inventory_type'
                ) {
                    if (type === 'inventory') {
                        errors.code = 'Ключи не могут быть введены в инвентарь';
                    } else {
                        errors.code = 'Инвентарь не может быть введен в ключи';
                    }
                }
            });
    };

    const {
        values,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
        isValid,
        handleBlur,
    } = useFormik<EnterCodeFormValues>({
        initialValues: { code: '' },
        onSubmit,
        validate: CodeFormValidate,
    });

    useEffect(() => {
        if (needWorker) {
            if (!worker) {
                errors.code = 'Сначала приложите карту';
            }
        }
    }, [errors, worker]);

    return (
        <form
            style={!worker?.id ? { width: '100%' } : undefined}
            className={scss.form}
            onSubmit={handleSubmit}
        >
            <h2 className={scss.form_title}>
                Добавьте или отсканируйте штрихкод
            </h2>
            <div className={scss.input_wrapper}>
                <Input
                    autoFocus
                    clearable
                    onBlur={handleBlur}
                    placeholder="Укажите код"
                    label="Введите код из 12 цифр"
                    type="number"
                    value={values.code}
                    name="code"
                    onChange={(e: any) => {
                        if (e?.target?.value) {
                            setFieldValue('code', e.target.value);
                        } else {
                            setFieldValue('code', e);
                        }
                    }}
                    autoComplete="off"
                    handleError={touched.code && errors.code}
                />
            </div>
            <div className={scss.button_wrapper}>
                <Button
                    disabled={!worker && touched.code && !isValid}
                    onClick={() => {}}
                    type="submit"
                >
                    Добавить
                </Button>
            </div>
        </form>
    );
};
