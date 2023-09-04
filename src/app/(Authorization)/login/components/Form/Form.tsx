'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import { Input } from 'components/UI/Inputs/Input';
import { IFormTypes } from 'app/(Authorization)/login/components/Form/Form.types';
import { FormValidate } from 'app/(Authorization)/login/components/Form/Form.utils';
import { userAuth, getUser } from 'http/userApi';
import { IUser } from 'store/types';
import { useUserStore } from 'store/userStore';
import { useRouter } from 'next/navigation';
import { Spinner } from 'components/Spinner';

import scss from './Form.module.scss';

export const Form = () => {
    const [loading, setLoading] = useState(false);
    const [setUser] = useUserStore((state) => [state.setUser]);

    const router = useRouter();

    const onSubmit = (values: IFormTypes) => {
        router.prefetch('/');
        setLoading(true);
        userAuth(values)
            .then(() =>
                getUser().then((user) => {
                    router.replace('/');
                    setUser(user as IUser);
                })
            )
            .catch((e) => {
                setErrors({ username: e.message, password: e.message });
            })
            .finally(() => setLoading(false));
    };

    const {
        values,
        handleChange,
        isValid,
        handleBlur,
        errors,
        handleSubmit,
        setErrors,
        touched,
    } = useFormik<IFormTypes>({
        initialValues: {
            username: '',
            password: '',
        },
        validate: FormValidate,
        onSubmit,
    });

    return (
        <div className={scss.form_wrapper}>
            <form
                onSubmit={handleSubmit}
                className={scss.form_content}
                autoComplete="off"
            >
                <h1 className={scss.form_header}>Вход</h1>
                <Input
                    size="big"
                    tabIndex={1}
                    name="username"
                    onBlur={handleBlur}
                    autoFocus={true}
                    placeholder="Введите логин"
                    value={values.username}
                    onChange={handleChange}
                    handleError={touched.username && errors.username}
                />
                <Input
                    size="big"
                    tabIndex={2}
                    name="password"
                    placeholder="Введите пароль"
                    value={values.password}
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    handleError={touched.password && errors.password}
                />
                <p className={scss.form_forgot_password}>Забыли пароль</p>
                <motion.button
                    tabIndex={3}
                    disabled={!isValid}
                    className={scss.form_button}
                    type="submit"
                >
                    Войти
                </motion.button>
                <p className={scss.accept_description}>
                    Вводя свой логин, вы подтверждаете, что согласны с нашими{' '}
                    <span className={scss.text_green}>
                        Условиями предоставления услуг
                    </span>
                </p>
            </form>
            {loading && <Spinner />}
        </div>
    );
};
