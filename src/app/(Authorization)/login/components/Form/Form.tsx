'use client';

import React, { useState } from 'react';

import { LoginForm } from 'app/(Authorization)/login/components/Form/LoginForm';
import { ForgotForm } from 'app/(Authorization)/login/components/Form/ForgotForm';

import scss from './Form.module.scss';
import { EnterPassForm } from 'app/(Authorization)/login/components/Form/EnterPassForm';

export const Form = () => {
    const [formType, setFormType] = useState<'login' | 'forgot' | 'enterPass'>(
        'login'
    );
    const [email, setEmail] = useState('');
    const setTypeAndEmail = (email: string, type: typeof formType) => {
        setEmail(email);
        setFormType(type);
    };

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
                        email={email}
                    />
                );
            case 'enterPass':
                return (
                    <EnterPassForm
                        setTypeAndEmail={setTypeAndEmail}
                        email={email}
                    />
                );
        }
    }

    return <div className={scss.form_wrapper}>{getForm()}</div>;
};
