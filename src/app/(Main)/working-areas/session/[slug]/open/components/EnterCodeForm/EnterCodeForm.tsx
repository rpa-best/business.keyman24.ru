import React, { useEffect } from 'react';

import { useFormik } from 'formik';
import {
    EnterCodeFormProps,
    EnterCodeFormValues,
} from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';
import { CodeFormValidate } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/EnterCodeForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { Input } from 'components/UI/Inputs/Input';
import { sendBarcode } from 'http/workingAreaApi';

import scss from './EnterCodeFOrm.module.scss';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export const EnterCodeForm: React.FC<EnterCodeFormProps> = ({
    worker,
    areaId,
    sessionId,
}) => {
    const router = useRouter();
    const onSubmit = async (values: EnterCodeFormValues) => {
        const body = {
            session: +sessionId,
            worker: +worker.id,
            barcode: values.code,
        };
        await sendBarcode(areaId, sessionId, body)
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
            })
            .finally(() => {
                router.refresh();
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
        if (!worker) {
            errors.code = 'Сначала приложите карту';
        }
    }, [errors, worker]);

    return (
        <form className={scss.form} onSubmit={handleSubmit}>
            <h2 className={scss.form_title}>
                Добавьте или отсканируйте штрихкод
            </h2>
            <div className={scss.input_wrapper}>
                <Input
                    onBlur={handleBlur}
                    placeholder="Укажите код"
                    label="Введите код из 12 цифр"
                    type="number"
                    value={values.code}
                    name="code"
                    onChange={(e: any) => setFieldValue('code', e.target.value)}
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
