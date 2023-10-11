import React from 'react';
import { cookies } from 'next/headers';

import { KeysWrapper } from 'app/(Main)/locations/components/KeysWrapper';
import { getLocationKeys } from 'http/locationsApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from 'app/(Main)/locations/locations.module.scss';
import { revalidatePath } from 'next/cache';

interface KeyPageProps {
    params: { locId: string; objId: string };
    searchParams: { offset: string };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params, searchParams }) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? 0;

    const orgId = cookieStore.get('orgId')?.value as string;

    const keys = await getLocationKeys(+orgId, +params.locId, +params.objId, {
        offset,
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.title_wrapper}>
                <h2 className={scss.page_title_with_table}>Ключи</h2>
                <div>
                    <BackButton>Назад</BackButton>
                </div>
            </div>
            <KeysWrapper keys={keys.results} count={keys.count} />
        </div>
    );
};

export default KeyPage;
