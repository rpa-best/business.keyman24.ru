'use client';

import { Button } from 'components/UI/Buttons/Button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import scss from 'app/(Main)/org-settings/bill/bill-history/BillHistory.module.scss';

export const HistoryButtonsWrapper = () => {
    const params = useSearchParams();
    const path = usePathname();
    const day = params.get('type') === 'day';

    return (
        <div className={scss.buttons}>
            <Link href={path + `?type=day`}>
                <Button
                    active={day}
                    rounded={false}
                    onClick={() => {}}
                    type="button"
                >
                    День
                </Button>
            </Link>
            <Link href={path + `?type=month`}>
                <Button
                    active={!day}
                    rounded={false}
                    onClick={() => {}}
                    type="button"
                >
                    Месяц
                </Button>
            </Link>
        </div>
    );
};
