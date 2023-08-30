import React from 'react';
import { cookies } from 'next/headers';

import { KeysWrapper } from 'app/(Main)/locations/components/KeysWrapper';
import { getLocationKeys } from 'http/locationsApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from 'app/(Main)/locations/locations.module.scss';

interface KeyPageProps {
    params: { locId: string; objId: string };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const keys = await getLocationKeys(+orgId, +params.locId, +params.objId);

    return (
        <div className={scss.children_with_table}>
            <div className={scss.title_wrapper}>
                <h2 className={scss.page_title_with_table}>Ключи</h2>
                <div>
                    <BackButton>Назад</BackButton>
                </div>
            </div>
            <KeysWrapper keys={keys.results} />
        </div>
    );
};

export default KeyPage;
