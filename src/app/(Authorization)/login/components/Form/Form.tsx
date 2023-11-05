'use client';

import React, { useEffect, useState } from 'react';

import { LoginForm } from 'app/(Authorization)/login/components/Form/LoginForm';
import { ForgotForm } from 'app/(Authorization)/login/components/Form/ForgotForm';
import { EnterPassForm } from 'app/(Authorization)/login/components/Form/EnterPassForm';
import Cookies from 'universal-cookie';

import scss from './Form.module.scss';

const cookie = new Cookies();

export const Form = () => {
    const [formType, setFormType] = useState<'login' | 'forgot' | 'enterPass'>(
        'login'
    );
    const [passwords, setPasswords] = useState({
        password1: '',
        password2: '',
    });
    const [email, setEmail] = useState('');
    const setTypeAndEmail = (email: string, type: typeof formType) => {
        setEmail(email);
        setFormType(type);
    };

    useEffect(() => {
        cookie.remove('orgId');
        cookie.remove('access');
        cookie.remove('refresh');
    }, []);

    function getForm() {
        switch (formType) {
            case 'login':
                return (
                    <LoginForm
                        email={email}
                        setTypeAndEmail={setTypeAndEmail}
                    />
                );
            case 'forgot':
                return (
                    <ForgotForm
                        setTypeAndEmail={setTypeAndEmail}
                        passwords={passwords}
                        email={email}
                    />
                );
            case 'enterPass':
                return (
                    <EnterPassForm
                        setPasswords={setPasswords}
                        setTypeAndEmail={setTypeAndEmail}
                        email={email}
                    />
                );
        }
    }

    return <div className={scss.form_wrapper}>{getForm()}</div>;
};
