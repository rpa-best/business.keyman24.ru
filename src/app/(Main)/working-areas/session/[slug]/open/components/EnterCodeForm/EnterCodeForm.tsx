import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { errorToastOptions, successToastConfig } from 'config/toastConfig';
import { useFormik } from 'formik';
import { IInventoryImage, IWorker } from 'http/types';
import { ImagesCarousel } from 'components/ImagesCarousel';
import { sendAction } from 'app/(Main)/working-areas/session/[slug]/open/components/Key/keys.utils';
import {
    EnterCodeFormProps,
    EnterCodeFormValues,
} from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/types';
import { CodeFormValidate } from 'app/(Main)/working-areas/session/[slug]/open/components/EnterCodeForm/EnterCodeForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { Input } from 'components/UI/Inputs/Input';

import scss from './EnterCodeFOrm.module.scss';
import { getWorkerOnClient } from 'http/workerApi';

export const EnterCodeForm: React.FC<EnterCodeFormProps> = ({
    worker,
    areaId,
    type,
    temporaryLog,
    setSessionLog,
    setTemporaryLog,
    sessionId,
    needWorker = true,
    setConfirmed,
    confirmed,
    setWorker,
}) => {
    const path = usePathname();

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<IInventoryImage[] | null>(null);

    useEffect(() => {
        if (confirmed) {
            const inventories = Promise.all(
                temporaryLog?.map((el) => {
                    if ('responsible' in el) {
                        return onSubmit(
                            { code: el.inventory.codeNumber },
                            false,
                            el.responsible
                        );
                    } else {
                        return onSubmit(
                            { code: el.inventory.codeNumber },
                            false
                        );
                    }
                })
            );

            inventories.then(() => {
                if (temporaryLog.length === 0) {
                    return;
                }
                toast('Успешно', successToastConfig);
                setTemporaryLog([]);
                setConfirmed(false);
                setImages([]);
                if (setWorker) {
                    setWorker(undefined);
                }
            });
        }
    }, [confirmed]);

    const onSubmit = async (
        values: EnterCodeFormValues,
        needValidate: boolean,
        responsible?: string
    ) => {
        let body = null;
        setLoading(true);
        setImages(null);
        const barcode = values.code.toString().split('');
        while (barcode.length !== 12) {
            barcode.unshift('0');
        }
        if (worker?.id) {
            body = {
                session: +sessionId,
                worker: +worker.id,
                barcode: barcode.join(''),
            };
        } else if (responsible) {
            body = {
                session: +sessionId,
                responsible,
                barcode: barcode.join(''),
            };

            setConfirmed(true);
        } else {
            body = {
                session: +sessionId,
                barcode: barcode.join(''),
            };
        }

        const alreadyHas = temporaryLog?.find(
            (el) => el.inventory.codeNumber === barcode.join('')
        );

        if (alreadyHas && needValidate) {
            toast(
                `Такой ${
                    type === 'inventory' || type === 'registerInventory'
                        ? 'инвентарь'
                        : 'ключ'
                } уже добавлен`,
                errorToastOptions
            );
            setLoading(false);
            return;
        }

        await sendAction({
            setTemporaryLog,
            body,
            areaId,
            type,
            setSessionLog,
            sessionId,
            validate: needValidate,
            setImages,
            path,
            setLoading,
            errors,
            resetForm,
        });
    };

    const {
        values,
        handleSubmit,
        resetForm,
        setFieldValue,
        errors,
        touched,
        isValid,
        handleBlur,
    } = useFormik<EnterCodeFormValues>({
        initialValues: { code: '' },
        onSubmit: (values) => {
            const responsible =
                values.code.startsWith('9') && values.code.length === 12;
            if (type === 'inventory' && responsible) {
                const workerId = values.code.slice(1).replace(/^0+/, '');
                if (+workerId === worker?.id) {
                    setConfirmed(true);
                    return;
                } else {
                    setTemporaryLog([]);
                    setImages(null);
                }
                getWorkerOnClient(+workerId).then((w) => {
                    if (setWorker) {
                        setWorker(w as IWorker);
                    }
                });
                return;
            }
            if (responsible) {
                setTemporaryLog((log) =>
                    log.map((logItem) => ({
                        ...logItem,
                        responsible: values.code,
                    }))
                );
                setConfirmed(true);
                return;
            }
            onSubmit(values, true);
        },
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
                <ImagesCarousel
                    setLoading={setLoading}
                    images={images}
                    loading={loading}
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
