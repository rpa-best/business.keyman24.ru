import React, { FC } from 'react';

import { Circles } from 'app/(Authorization)/login/components/Circles';
import { Form } from 'app/(Authorization)/login/components/Form/Form';

import scss from './LoginPage.module.scss';

const LoginPage: FC = () => {
    return (
        <main className={scss.login_layout}>
            <Circles />
            <div className={scss.preview_wrapper}>
                <h1 className={scss.logo}>KeyMan24</h1>
                <div className={scss.preview_content}>
                    <h1 className={scss.preview_content_header}>
                        Lorem ipsum{' '}
                    </h1>
                    <p className={scss.preview_content_text}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tempora blanditiis eveniet quis eaque quisquam
                        repudiandae. Inventore enim, odio unde velit dicta
                        deserunt! Provident ullam reprehenderit recusandae a,
                        vel quia aperiam.
                    </p>
                </div>
            </div>
            <Form />
        </main>
    );
};

export default LoginPage;
