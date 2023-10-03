'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import EditSvg from '/public/svg/edit.svg';
import AvatarSvg from '/public/svg/avatar.svg';
import { Input } from 'components/UI/Inputs/Input';
import { IWorkerEditFormProps } from 'app/(Main)/workers/types';
import { useFormik } from 'formik';
import { WorkerFormValuesType } from 'app/(Main)/workers/[id]/components/WorkerEditForm/types';
import {
    WorkerCreateFormValidate,
    WorkerEditFormValidate,
} from 'app/(Main)/workers/[id]/components/WorkerEditForm/WorkerEditForm.utils';
import { Button } from 'components/UI/Buttons/Button';
import { useRouter } from 'next/navigation';
import { CreateWorkerUserBody } from 'http/types';
import { createWorkerUser } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { AxiosError } from 'axios';
import { InputMask } from 'components/UI/Inputs/InputMask';
import { toast } from 'react-toastify';
import { subAction } from 'helpers/subAction';
import { useConstructorStore } from 'store/useConstructorStore';
import { useModalStore } from 'store/modalVisibleStore';

import scss from './WorkerEditForm.module.scss';
import { Modal } from 'components/Modal';
import { ChangeImgModal } from 'app/(Main)/workers/[id]/components/ChangeImgModal';

export const WorkerEditForm: React.FC<IWorkerEditFormProps> = ({
    worker,
    workerUser,
}) => {
    const [setVisible] = useModalStore((state) => [state.setVisible]);
    const [fields] = useConstructorStore((state) => [state.fields]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
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
                subAction(fields, 'User', 1, 'add');
                router.refresh();
                toast('Успешно', {
                    position: 'bottom-right',
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'success',
                    theme: 'colored',
                });
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
                    {worker?.image ? (
                        <Image
                            style={{ borderRadius: '50%' }}
                            src={worker.image}
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
                        onClick={() => setVisible(true)}
                        className={scss.change_img_wrapper}
                    >
                        <EditSvg />
                    </button>
                </div>
                <div className={scss.worker_card_data}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
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
                            autoComplete="off"
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
            {worker.user === null && (
                <div className={scss.worker_card_data_additional}>
                    <div className={scss.worker_card_input_wrapper}>
                        <Input
                            autoComplete="off"
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
                <ChangeImgModal workerId={worker.id} />
            </Modal>
            {loading && <Spinner />}
        </form>
    );
};
