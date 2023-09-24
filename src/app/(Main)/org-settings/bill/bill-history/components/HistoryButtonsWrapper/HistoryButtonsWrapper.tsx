'use client';

import { Button } from 'components/UI/Buttons/Button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import scss from 'app/(Main)/org-settings/bill/bill-history/BillHistory.module.scss';

export const HistoryButtonsWrapper = () => {
    const router = useRouter();
    const params = useSearchParams();
    const path = usePathname();
    const day = params.get('type') === 'day';
    const handleButtonClick = (type: 'day' | 'month') => {
        router.replace(path + `?type=${type}`);
    };

    return (
        <div className={scss.buttons}>
            <Button
                active={day}
                rounded={false}
                onClick={() => handleButtonClick('day')}
                type="button"
            >
                День
            </Button>
            <Button
                active={!day}
                rounded={false}
                onClick={() => handleButtonClick('month')}
                type="button"
            >
                Месяц
            </Button>
        </div>
    );
};
