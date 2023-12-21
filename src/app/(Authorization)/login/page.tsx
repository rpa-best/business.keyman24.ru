import React, { FC } from 'react';

import { Circles } from 'app/(Authorization)/login/components/Circles';
import { Form } from 'app/(Authorization)/login/components/Form/Form';

import scss from './LoginPage.module.scss';
import { getOrganizations } from 'http/organizationApi';
import { redirect } from 'next/navigation';

const LoginPage: FC = async () => {
    const organizations = await getOrganizations().catch((e) => {});

    if (organizations) {
        redirect('/');
    }

    return (
        <main className={scss.login_layout}>
            <Circles />
            <div className={scss.preview_wrapper}>
                <h1 className={scss.logo}>KeyMan24</h1>
                <div className={scss.preview_content}>
                    <h1 className={scss.preview_content_header}>KeyMan</h1>
                    <p className={scss.preview_content_text}>
                        Автоматизированная система для контроля доступа
                        иностранным работникам на объекты по документам. С
                        быстрым и прозрачным учетом выдачи ключей, инструментов
                        и прочих ТМЦ.
                    </p>
                </div>
            </div>
            <Form />
        </main>
    );
};

export default LoginPage;
