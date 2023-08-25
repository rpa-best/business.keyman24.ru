import React from 'react';

import scss from './SessionPage.module.scss';
import { getSessions, getWorkingAreas } from 'http/workingAreaApi';
import { cookies } from 'next/headers';
import { SessionWrapper } from 'app/(Main)/working-areas/session/components/SessionWrapper';
import { DateHelper } from 'helpers/dateHelper';

interface SessionPageProps {
    params: { slug: string };
}

const SessionPage: React.FC<SessionPageProps> = async ({ params }) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const workingAreas = await getWorkingAreas(+orgId);

    const area = workingAreas.results.find(
        (area) => area.type.slug === params.slug
    );

    const sessions = await getSessions(+orgId, area?.id as number);

    const modifiedSessions = sessions.results.map((s) => {
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
    });

    return (
        <div className={scss.children_with_table}>
            <h1 className={scss.page_title_with_table}>
                Сессии в {area?.name} / Список
            </h1>
            <SessionWrapper
                areaId={area?.id as number}
                type={params.slug as any}
                sessions={modifiedSessions}
            />
        </div>
    );
};

export default SessionPage;
