'use client';

import { Button } from 'components/UI/Buttons/Button';
import Link from 'next/link';

import scss from './WorkersModal.module.scss';

export const WorkersModal = () => {
    return (
        <div className={scss.description_wrapper}>
            <h3 className={scss.desc_title}>Загрузка работников</h3>
            <p className={scss.desc_text}>Чтобы загрузить работников нужно:</p>
            <ul className={scss.steps_list}>
                <li className={scss.list_step}>
                    1. Перейти по указанной ссылке{' '}
                    <Link
                        target="_blank"
                        href="https://www.guestworkers.ru/lk/"
                        className={scss.link}
                    >
                        https://www.guestworkers.ru/lk/
                    </Link>
                </li>
                <li className={scss.list_step}>
                    2. Войти под своей почтой и паролем
                </li>
                <li className={scss.list_step}>
                    3. Загрузить таблицу с работниками
                </li>
            </ul>
            <Link
                target="_blank"
                href="https://www.guestworkers.ru/lk/"
                className={scss.button_wrapper}
            >
                <Button onClick={() => {}} type="button">
                    Перейти
                </Button>
            </Link>
        </div>
    );
};
