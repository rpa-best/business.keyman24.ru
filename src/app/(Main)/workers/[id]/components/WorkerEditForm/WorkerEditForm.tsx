'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { IWorkerEditFormProps } from 'app/(Main)/workers/types';
import { useFormik } from 'formik';
import { WorkerFormValuesType } from 'app/(Main)/workers/[id]/components/WorkerEditForm/types';
import { WorkerEditFormValidate } from 'app/(Main)/workers/[id]/components/WorkerEditForm/WorkerEditForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { useRouter } from 'next/navigation';
import { CreateWorkerUserBody } from 'http/types';
import { createWorkerUser } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { AxiosError } from 'axios';

import scss from './WorkerEditForm.module.scss';

export const WorkerEditForm: React.FC<IWorkerEditFormProps> = ({
    worker,
    workerUser,
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async (values: WorkerFormValuesType) => {
        setLoading(true);
        const workerBody: CreateWorkerUserBody = {
            phone: values.phone,
            username: values.username,
            password1: values.password as string,
            password2: values.confirmPassword as string,
        };

        await createWorkerUser(worker.id, workerBody)
            .catch((e: AxiosError<{ password1: string[] }>) => {
                errors.password = e.response?.data?.password1[0];
            })
            .finally(() => {
                router.refresh();
                setTimeout(() => setLoading(false), 100);
            });
    };

    const {
        touched,
        isValid,
        values,
        errors,
        handleBlur,
        handleSubmit,
        handleChange,
    } = useFormik<WorkerFormValuesType>({
        initialValues: {
            name: worker.name,
            username: workerUser?.username ?? '',
            phone: workerUser?.phone ?? '',
            confirmPassword: '',
            password: '',
        },
        enableReinitialize: true,
        onSubmit,
        validate: WorkerEditFormValidate,
    });

    return (
        <form onSubmit={handleSubmit} className={scss.worker_card_layout}>
            <h2 className={scss.worker_card_title}>Информация о работнике</h2>
            <div className={scss.worker_content}>
                <div className={scss.worker_card_image_wrapper}>
                    {worker?.image ? (
                        <Image
                            src={worker.image}
                            alt="Изображение работника"
                            fill
                        />
                    ) : (
                        <AvatarSvg style={{ width: '100%', height: '100%' }} />
                    )}
                </div>
                <div className={scss.worker_card_data}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            onBlur={handleBlur}
                            label="ФИО"
                            placeholder="-"
                            value={values.name}
                            handleError={touched.name && errors.name}
                            name="name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            onBlur={handleBlur}
                            placeholder="-"
                            label="Логин"
                            handleError={touched.username && errors.username}
                            value={values.username}
                            name="username"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            onBlur={handleBlur}
                            label="Телефон"
                            placeholder="Укажите телефон"
                            value={values.phone}
                            handleError={touched.phone && errors.phone}
                            name="phone"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            {worker.user === null && (
                <div className={scss.worker_card_data_additional}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            onBlur={handleBlur}
                            type="password"
                            label="Пароль"
                            placeholder="Введите пароль"
                            value={values.password ?? ''}
                            handleError={
                                touched.confirmPassword &&
                                touched.password &&
                                errors.password
                            }
                            name="password"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            type="password"
                            onBlur={handleBlur}
                            label="Подтверждение пароля"
                            placeholder="Введите пароль ещё раз"
                            value={values.confirmPassword ?? ''}
                            handleError={
                                touched.password &&
                                touched.confirmPassword &&
                                errors.password
                            }
                            name="confirmPassword"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}
            <div className={scss.worker_card_button_wrapper}>
                <Button disabled={!isValid} onClick={() => {}} type="submit">
                    Сохранить
                </Button>
            </div>
            {loading && <Spinner />}
        </form>
    );
};
