import React from 'react';

import { KeysWrapper } from 'app/(Main)/locations/components/KeysWrapper';
import { cookies } from 'next/headers';

import scss from 'app/(Main)/locations/locations.module.scss';
import { getLocationKeys } from 'http/locationsApi';

interface KeyPageProps {
    params: { locId: string; objId: string };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const keys = await getLocationKeys(+orgId, +params.locId, +params.objId);

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Сгенерировать ключи</h2>
            <KeysWrapper keys={keys.results} />
        </div>
    );
};

export default KeyPage;
