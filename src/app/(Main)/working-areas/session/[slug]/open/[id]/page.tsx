import React from 'react';
import { cookies } from 'next/headers';

import { Inventory } from 'app/(Main)/working-areas/session/[slug]/open/components/Inventory';
import { Key } from 'app/(Main)/working-areas/session/[slug]/open/components/Key';
import { Register } from 'app/(Main)/working-areas/session/[slug]/open/components/Register';
import { Security } from 'app/(Main)/working-areas/session/[slug]/open/components/Security';
import {
    getSessionLog,
    getSessions,
    getWorkingAreas,
} from 'http/workingAreaApi';
import { getOrganizations } from 'http/organizationApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './OpenSession.module.scss';

interface OpenSessionPage {
    params: {
        slug:
            | 'register'
            | 'security'
            | 'inventory'
            | 'register_inventory'
            | 'key';
        id: string;
    };
}

const OpenSessionPage: React.FC<OpenSessionPage> = async ({ params }) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const organizations = await getOrganizations();

    const workingAreas = await getWorkingAreas(+orgId);

    const area = workingAreas.results.find(
        (area) => area.type.slug === params.slug
    );

    const sessionLog = await getSessionLog(
        +orgId,
        area?.id as number,
        +params.id
    );

    const modifiedLog = sessionLog.results.map((s) => {
        return { ...s, workerName: s.worker.name };
    });

    switch (params.slug) {
        case 'inventory': {
            return (
                <div className={scss.children_with_table}>
                    <div className={scss.page_title_with_table_back_button}>
                        <h1>{area?.name}</h1>
                        <BackButton skipWord>Назад</BackButton>
                    </div>
                    <Key
                        sessionLog={modifiedLog}
                        currentSessionId={+params.id}
                        currentAreaId={area?.id as number}
                        organizations={organizations}
                    />
                </div>
            );
        }
        case 'key': {
            return (
                <div className={scss.children_with_table}>
                    <div className={scss.page_title_with_table_back_button}>
                        <h1>{area?.name}</h1>
                        <BackButton skipWord>Назад</BackButton>
                    </div>
                    <Key
                        sessionLog={modifiedLog}
                        currentSessionId={+params.id}
                        currentAreaId={area?.id as number}
                        organizations={organizations}
                    />
                </div>
            );
        }
        case 'register': {
            return (
                <div className={scss.children_with_table}>
                    <div className={scss.page_title_with_table_back_button}>
                        <h1>{area?.name}</h1>
                        <BackButton skipWord>Назад</BackButton>
                    </div>
                    <Register
                        currentSessionId={+params.id}
                        currentAreaId={area?.id as number}
                        organizations={organizations}
                    />
                </div>
            );
        }
        case 'security': {
            return (
                <div className={scss.children_with_table}>
                    <div className={scss.page_title_with_table_back_button}>
                        <h1>{area?.name}</h1>
                        <BackButton skipWord>Назад</BackButton>
                    </div>
                    <Security
                        sessionLog={modifiedLog}
                        currentSessionId={+params.id}
                        currentAreaId={area?.id as number}
                    />
                </div>
            );
        }
    }

    return <h1>{params.id}</h1>;
};

export default OpenSessionPage;
