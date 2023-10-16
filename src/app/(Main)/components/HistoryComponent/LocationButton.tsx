'use client';

import { Button } from 'components/UI/Buttons/Button';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const LocationButton = () => {
    const path = usePathname();
    const query = useSearchParams();

    const register = query.get('register');

    return (
        <Link href={register ? path : path + '?register=true'}>
            <Button type="button" onClick={() => {}}>
                {register ? 'По работникам' : 'По локациям'}
            </Button>
        </Link>
    );
};
