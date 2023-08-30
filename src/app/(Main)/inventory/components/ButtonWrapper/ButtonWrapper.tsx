'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'components/UI/Buttons/Button';

export const ButtonWrapper = () => {
    const router = useRouter();

    const pathname = usePathname();

    const handleButtonClick = () => {
        router.push(`${pathname}/key-generate`);
    };

    return (
        <Button onClick={() => handleButtonClick()} type="button">
            Генерация ключей
        </Button>
    );
};
