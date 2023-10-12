'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';

import EditSvg from '/public/svg/edit.svg';
import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { IWorkerEditFormProps } from 'app/(Main)/workers/types';
import { WorkerFormValuesType } from 'app/(Main)/workers/[id]/components/WorkerEditForm/types';
import {
    WorkerCreateFormValidate,
    WorkerEditFormValidate,
} from 'app/(Main)/workers/[id]/components/WorkerEditForm/WorkerEditForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { usePathname } from 'next/navigation';
import { CreateWorkerUserBody } from 'http/types';
import { createWorkerUser } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { InputMask } from 'components/UI/Inputs/InputMask';
import { Modal } from 'components/Modal';
import { ChangeImgModal } from 'app/(Main)/workers/[id]/components/ChangeImgModal';
import revalidate from 'utils/revalidate';
import { useModalStore } from 'store/modalVisibleStore';
import { successToastConfig } from 'config/toastConfig';

import scss from './WorkerEditForm.module.scss';

export const WorkerEditForm: React.FC<IWorkerEditFormProps> = ({
    worker,
    workerUser,
    onUserSubmit,
}) => {
    const [workerImg, setWorkerImg] = useState(worker.image);

    const path = usePathname();

    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: WorkerFormValuesType) => {
        setLoading(true);
        const tel = values.phone.replace(/[()-]/g, '');
        const workerBody: CreateWorkerUserBody = {
            phone: tel,
            username: values.username,
            password1: values.password as string,
            password2: values.confirmPassword as string,
        };
        await createWorkerUser(worker.id, workerBody)
            .then(() => {
                onUserSubmit(tel, values.username);
                revalidate(path);
                toast('Успешно', successToastConfig);
            })
            .catch((e: unknown) => {
                if (e instanceof AxiosError) {
                    if (e.response) {
                        if (
                            e.response.data &&
                            e.response.data.phone &&
                            e.response.data.phone[0] &&
                            e.response.data.phone[0].phone.slug ===
                                'user_already_has_with_this_phone'
                        ) {
                            errors.phone = 'Этот телефон занят';
                        }
                        if (
                            e.response.data &&
                            e.response.data.password1 &&
                            e.response.data.password1.flat(1) &&
                            e.response.data.password1.flat(1)[0] ===
                                'Введённый пароль слишком широко распространён.'
                        ) {
                            errors.password = 'Пароль слишком простой';
                            errors.confirmPassword = 'Пароль слишком простой';
                        }
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const {
        touched,
        isValid,
        values,
        errors,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
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
        validate: workerUser
            ? WorkerEditFormValidate
            : WorkerCreateFormValidate,
    });

    return (
        <form onSubmit={handleSubmit} className={scss.worker_card_layout}>
            <h2 className={scss.worker_card_title}>Информация о работнике</h2>
            <div className={scss.worker_content}>
                <div className={scss.worker_card_image_wrapper}>
                    {workerImg ? (
                        <Image
                            style={{ borderRadius: '50%' }}
                            src={workerImg}
                            alt="Изображение работника"
                            fill
                        />
                    ) : (
                        <AvatarSvg
                            style={{
                                width: '100%',
                                height: '100%',
                                color: '#414141',
                            }}
                        />
                    )}
                    <button
                        onClick={() => {
                            setVisible(true);
                        }}
                        className={scss.change_img_wrapper}
                    >
                        <EditSvg />
                    </button>
                </div>
                <div className={scss.worker_card_data}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            disabled
                            autoComplete="off"
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
                            autoComplete="new-password"
                            onBlur={handleBlur}
                            placeholder="-"
                            label="Почта"
                            handleError={touched.username && errors.username}
                            value={values.username}
                            name="username"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={scss.worker_card_input_wrapper}>
                        <InputMask
                            label="Введите номер телефона"
                            name="phone"
                            placeholder="+7(___)___-__-__"
                            handleError={errors.phone}
                            value={values.phone}
                            alwaysShowMask={true}
                            autoFocus={true}
                            mask="+7(999)999-99-99"
                            onBlur={() => setFieldTouched('phone', true)}
                            onChange={(value: string) => {
                                setFieldTouched('phone', true);
                                setFieldValue('phone', value);
                            }}
                            type="tel"
                        />
                    </div>
                </div>
            </div>
            {workerUser === null && (
                <div className={scss.worker_card_data_additional}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            autoComplete="new-password"
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
                            autoComplete="off"
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
            <Modal>
                <ChangeImgModal
                    setLoading={setLoading}
                    setWorkerImg={setWorkerImg}
                    workerId={worker.id}
                />
            </Modal>
            {loading && <Spinner />}
        </form>
    );
};
