'use client';

import { useEffect } from 'react';
import { Button } from 'components/UI/Buttons/Button';

import scss from './MainPage.module.scss';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <div className={scss.error_wrapper}>
            <h2>Что-то пошло не так!</h2>
            <div>
                <Button type="button" onClick={() => reset()}>
                    Обновить страницу
                </Button>
            </div>
        </div>
    );
}
