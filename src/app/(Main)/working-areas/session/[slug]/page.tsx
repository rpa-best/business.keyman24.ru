import React from 'react';

import {
    getSessions,
    getWorkingArea,
    getWorkingAreas,
} from 'http/workingAreaApi';
import { cookies } from 'next/headers';
import { SessionWrapper } from 'app/(Main)/working-areas/session/components/SessionWrapper';
import { DateHelper } from 'utils/dateHelper';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';

import scss from './SessionPage.module.scss';

interface SessionPageProps {
    params: { slug: string };
    searchParams?: { offset: string; archive: string };
}

const SessionPage: React.FC<SessionPageProps> = async ({
    params,
    searchParams,
}) => {
    const cookieStore = cookies();

    const offset = searchParams?.offset ?? '0';

    const orgId = cookieStore.get('orgId')?.value as string;

    const id = getParamsId(params.slug);

    const area = await getWorkingArea(+orgId, +id);

    const type = getParamsType(params.slug);

    const sessions = await getSessions(
        +orgId,
        area?.id as number,
        searchParams?.archive,
        offset
    );

    const modifiedSessions = {
        ...sessions,
        results: sessions.results.map((s) => {
            const startDate = new DateHelper(s.startDate);
            const endDate = new DateHelper(s.endDate ?? '');
            if (s.status === 1) {
                return {
                    ...s,
                    status: 'В процессе',
                    startDate: `${startDate.getDate} в ${startDate.getTime}`,
                    endDate: '-',
                };
            } else {
                return {
                    ...s,
                    status: 'Завершена',
                    startDate: `${startDate.getDate} в ${startDate.getTime}`,
                    endDate: `${endDate.getDate} в ${endDate.getTime}`,
                };
            }
        }),
    };

    return (
        <div className={scss.children_with_table}>
            <div className={scss.button_wrapper}>
                <h1>
                    Сессии в {area?.name} /{' '}
                    {searchParams?.archive ? 'Архив' : 'Список'}
                </h1>
                <BackButton skipTwoWords>Назад</BackButton>
            </div>
            <SessionWrapper
                areaId={area?.id as number}
                type={
                    type as
                        | 'register'
                        | 'security'
                        | 'inventory'
                        | 'key'
                        | 'register_inventory'
                }
                sessions={modifiedSessions}
            />
        </div>
    );
};

export default SessionPage;
