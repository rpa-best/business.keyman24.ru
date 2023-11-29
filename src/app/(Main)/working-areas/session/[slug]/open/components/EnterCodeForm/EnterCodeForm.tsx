import React, { useEffect, useState } from 'react';
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
import { IInventoryImage } from 'http/types';
import { getInventoryImage } from 'http/inventoryApi';
import { ImagesCarousel } from 'components/ImagesCarousel';

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

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<IInventoryImage[] | null>(null);
    const onSubmit = async (values: EnterCodeFormValues) => {
        let body = null;
        setLoading(true);
        setImages(null);
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
                if (type !== 'keys') {
                    getInventoryImage(d.inventory.id)
                        .then((d) => {
                            setImages(d.results);
                        })
                        .finally(() => setLoading(false));
                }
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
                errors.code = e.response.data.error[0].name;
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
            <div
                style={{ marginBottom: type !== 'keys' ? 0 : undefined }}
                className={scss.input_wrapper}
            >
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
            <div className={scss.images_wrapper}>
                <ImagesCarousel images={images} loading={loading} />
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
