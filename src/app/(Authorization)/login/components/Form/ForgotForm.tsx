import React, { useEffect, useState } from 'react';
import { FormikErrors, useFormik } from 'formik';

import RayArrow from '/public/svg/rayArrow.svg';
import { PinCodeInput } from 'components/UI/Inputs/PinCodeInput/PinCodeInput';
import { IPinCodeFormTypes } from 'app/(Authorization)/login/components/Form/Form.types';
import {
    CheckingPinFormUtils,
    fullFilled,
} from 'app/(Authorization)/login/components/Form/Form.utils';

import scss from 'app/(Authorization)/login/components/Form/Form.module.scss';
import { changePassword, checkEmail } from 'http/userApi';
import { toast } from 'react-toastify';
import { errorToastOptions, successToastConfig } from 'config/toastConfig';
import { AxiosError } from 'axios';

interface ForgotFormProps {
    setTypeAndEmail: (email: string, type: 'login' | 'enterPass') => void;
    email: string;
    passwords: { password1: string; password2: string };
}

export const ForgotForm: React.FC<ForgotFormProps> = ({
    setTypeAndEmail,
    email,
    passwords: { password1, password2 },
}) => {
    const [timer, setTimer] = useState(30);
    const [sended, setSended] = useState(false);

    const onSubmit = () => {
        changePassword(values.join(''), email, password1, password2)
            .then(() => {
                setTypeAndEmail(email, 'login');
                toast('Пароль успешно изменён', successToastConfig);
            })
            .catch((e) => {
                if (e instanceof AxiosError) {
                    if (
                        e.response?.data.password1[0][0] ===
                        'Введённый пароль слишком широко распространён.'
                    ) {
                        toast(
                            'Введённый пароль слишком простой',
                            errorToastOptions
                        );
                        setTypeAndEmail(email, 'enterPass');
                    }
                }
            });
    };

    const {
        values,
        errors,
        submitForm,
        isValid,
        validateForm,
        setValues,
        handleSubmit,
    } = useFormik<IPinCodeFormTypes>({
        initialValues: ['', '', '', '', '', ''],
        onSubmit,
        validate: CheckingPinFormUtils,
    });

    useEffect(() => {
        if (sended) {
            const timeout = setTimeout(() => {
                if (timer > 1) {
                    setTimer((t) => t - 1);
                    clearTimeout(timeout);
                } else {
                    setSended(false);
                    setTimer(30);
                    clearTimeout(timeout);
                }
            }, 1000);
        }
    }, [sended, timer]);

    useEffect(() => {
        if (isValid) {
            if (fullFilled(values)) {
                submitForm();
            }
        }
    }, [isValid, submitForm, values]);

    return (
        <>
            <form className={scss.form_content} onSubmit={handleSubmit}>
                <div className={scss.forgot_title}>
                    <RayArrow onClick={() => setTypeAndEmail(email, 'login')} />
                    <h1>Восстановление пароля</h1>
                </div>
                <p className={scss.pin_description}>
                    Введите код, отправленный на <span>{email}</span>
                </p>
                <PinCodeInput
                    validateForm={validateForm}
                    errors={errors as FormikErrors<{ code: string }>}
                    digits={values}
                    changeHandler={setValues}
                />
                <p
                    style={{
                        width: 'max-content',
                        pointerEvents: sended ? 'none' : 'auto',
                    }}
                    onClick={async () => {
                        setSended(true);
                        await submitForm();
                        await checkEmail(email);
                    }}
                    className={scss.form_send_again}
                >
                    {sended
                        ? `Повторный код можно отправить через ${timer}`
                        : 'Отправить ещё раз'}
                </p>
            </form>
        </>
    );
};
