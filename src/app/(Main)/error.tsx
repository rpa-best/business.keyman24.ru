'use client';

import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';

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
        <div>
            <h2>Что-то пошло не так!</h2>
            <div>
                <Button type="button" onClick={() => reset()}>
                    Обновить страницу
                </Button>
            </div>
        </div>
    );
}
