import React, { useState } from 'react';

import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import RayArrow from '/public/svg/rayArrow.svg';
import { Input } from 'components/UI/Inputs/Input';
import { Spinner } from 'components/Spinner';

import {
    ILoginFormTypes,
    IPassFormTypes,
} from 'app/(Authorization)/login/components/Form/Form.types';

import {
    LoginFormValidate,
    PassFormValidate,
} from 'app/(Authorization)/login/components/Form/Form.utils';

import scss from 'app/(Authorization)/login/components/Form/Form.module.scss';

interface EnterPassForm {
    email: string;
    setTypeAndEmail: (email: string, type: 'login') => void;
}

export const EnterPassForm: React.FC<EnterPassForm> = ({
    setTypeAndEmail,
    email,
}) => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (values: IPassFormTypes) => {
        setTypeAndEmail(email, 'login');
    };

    const {
        values,
        handleChange,
        isValid,
        handleBlur,
        errors,
        handleSubmit,
        touched,
    } = useFormik<IPassFormTypes>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: PassFormValidate,
        onSubmit,
    });

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className={scss.form_content}
                autoComplete="off"
            >
                <div className={scss.forgot_title}>
                    <RayArrow onClick={() => setTypeAndEmail(email, 'login')} />
                    <h1>Восстановление пароля</h1>
                </div>
                <Input
                    size="big"
                    tabIndex={1}
                    name="password"
                    type="password"
                    onBlur={handleBlur}
                    autoFocus={true}
                    placeholder="Введите новый пароль"
                    value={values.password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    handleError={touched.password && errors.password}
                />
                <Input
                    size="big"
                    tabIndex={2}
                    name="confirmPassword"
                    placeholder="Подтвердите новый пароль"
                    value={values.confirmPassword}
                    type="password"
                    autoComplete="new-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    handleError={
                        touched.confirmPassword && errors.confirmPassword
                    }
                />
                <motion.button
                    tabIndex={3}
                    disabled={!isValid}
                    className={scss.form_button}
                    type="submit"
                >
                    Сохранить
                </motion.button>
            </form>
            {loading && <Spinner />}
        </>
    );
};
