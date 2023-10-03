import React from 'react';
import { cookies } from 'next/headers';

import { getKeyHistory } from 'http/locationsApi';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { HistoryComponent } from 'app/(Main)/components/HistoryComponent';

import scss from './KeyHistoryPage.module.scss';

interface KeyPageProps {
    searchParams: { offset: string };
    params: {
        locId: string;
        objId: string;
        keyId: string;
    };
}

const KeyPage: React.FC<KeyPageProps> = async ({ params, searchParams }) => {
    const cookieStore = cookies();

    const offset = searchParams.offset ?? 0;

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const keyHistory = await getKeyHistory(
        +orgId,
        +params.locId,
        +params.objId,
        +params.keyId,
        +offset
    );

    return (
        <>
            <div className={scss.custom_title_wrapper}>
                <h1>История ключа {params.keyId}</h1>
                <BackButton skipWord>Назад</BackButton>
            </div>
            <HistoryComponent type="Keys" keyHistory={keyHistory} />
        </>
    );
};

export default KeyPage;
