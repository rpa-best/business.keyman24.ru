import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import Cookies from 'universal-cookie';

import { Input } from 'components/UI/Inputs/Input';
import { Spinner } from 'components/Spinner';
import { useUserStore } from 'store/userStore';
import { useRouter } from 'next/navigation';
import { ILoginFormTypes } from 'app/(Authorization)/login/components/Form/Form.types';
import { checkEmail, getUser, userAuth } from 'http/userApi';
import { getClientOrganizations } from 'http/organizationApi';
import { IUser } from 'store/types';
import { LoginFormValidate } from 'app/(Authorization)/login/components/Form/Form.utils';

import scss from 'app/(Authorization)/login/components/Form/Form.module.scss';
import { errorToastOptions, warningToastConfig } from 'config/toastConfig';

const cookie = new Cookies();

interface LoginFormProps {
    email: string;
    setTypeAndEmail: (email: string, type: 'enterPass') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    setTypeAndEmail,
    email,
}) => {
    const [loading, setLoading] = useState(false);
    const [setUser] = useUserStore((state) => [state.setUser]);

    const router = useRouter();

    const onSubmit = (values: ILoginFormTypes) => {
        setLoading(true);
        userAuth(values)
            .then((data) => {
                getClientOrganizations().then((d) => {
                    cookie.set('orgId', d[0].id.toString());
                    router.prefetch('/');
                });
                getUser(data.access).then((user) => {
                    router.replace('/');
                    setUser(user as IUser);
                });
            })
            .catch((e: AxiosError) => {
                if (
                    (e?.response?.data as any)?.message[0].slug ===
                    'username_or_password_invalid'
                ) {
                    setErrors({
                        username: 'Неправильный логин или пароль',
                        password: 'Неправильный логин или пароль',
                    });
                } else {
                    toast('Непредвиденная ошибка', {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                        theme: 'colored',
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const {
        values,
        handleChange,
        isValid,
        validateField,
        handleBlur,
        errors,
        handleSubmit,
        setErrors,
        touched,
    } = useFormik<ILoginFormTypes>({
        initialValues: {
            username: email,
            password: '',
        },
        validate: LoginFormValidate,
        onSubmit,
    });

    const handleForgotPassword = () => {
        validateField('username').then(() => {
            if (errors.username) {
                toast(
                    'Укажите почту от аккаунта и нажмите ещё раз',
                    warningToastConfig
                );
            } else {
                setLoading(true);
                checkEmail(values.username)
                    .then(() => {
                        setTypeAndEmail(values.username, 'enterPass');
                        setLoading(false);
                    })
                    .catch((e) => {
                        if (e instanceof AxiosError) {
                            toast(
                                e.response?.data.email[0].email.name,
                                errorToastOptions
                            );
                        }
                    });
            }
        });
    };

    return (
        <>
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
                    placeholder="Введите почту"
                    value={values.username}
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    handleError={touched.password && errors.password}
                />
                <p
                    onClick={() => handleForgotPassword()}
                    className={scss.form_forgot_password}
                >
                    Забыли пароль
                </p>
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
        </>
    );
};
