import React from 'react';
import { cookies } from 'next/headers';

import { Key } from 'app/(Main)/working-areas/session/[slug]/open/components/Key';
import { Register } from 'app/(Main)/working-areas/session/[slug]/open/components/Register';
import { Security } from 'app/(Main)/working-areas/session/[slug]/open/components/Security';
import { getSessionLog, getWorkingAreas } from 'http/workingAreaApi';
import { getOrganizations } from 'http/organizationApi';
import { BackButton } from 'components/UI/Buttons/BackButton';

import scss from './OpenSession.module.scss';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';

interface OpenSessionPage {
    params: {
        slug: string;
        id: string;
    };
}

const OpenSessionPage: React.FC<OpenSessionPage> = async ({ params }) => {
    const cookieStore = cookies();

    const areaId = +getParamsId(params.slug);

    const areaType = getParamsType(params.slug);

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const organizations = await getOrganizations();

    const workingAreas = await getWorkingAreas(+orgId);

    const area = workingAreas.results.find((area) => +area.id === areaId);

    const sessionLog = await getSessionLog(
        +orgId,
        area?.id as number,
        +params.id
    );

    const modifiedLog = sessionLog.results.map((s) => {
        const mode = s.mode ? 'Зашёл' : 'Вышел';
        return { ...s, workerName: s.worker.name, modeName: mode };
    });

    const keyLog = modifiedLog.map((l) => {
        const mode = l.mode ? 'Выдан' : 'Сдан';
        return {
            ...l,
            modeName: mode,
            inventoryName: `${l?.inventory?.id} ${l?.inventory?.name}`,
        };
    });

    console.log(sessionLog);

    switch (areaType) {
        case 'inventory': {
            return (
                <div className={scss.children_with_table}>
                    <div className={scss.page_title_with_table_back_button}>
                        <h1>{area?.name}</h1>
                        <BackButton skipWord>Назад</BackButton>
                    </div>
                    <Key
                        type="inventory"
                        sessionLog={keyLog}
                        currentSessionId={+params.id}
                        currentAreaId={areaId}
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
                        type="keys"
                        sessionLog={keyLog}
                        currentSessionId={+params.id}
                        currentAreaId={areaId}
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
                        sessionLog={keyLog}
                        currentSessionId={+params.id}
                        currentAreaId={areaId}
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
                        currentAreaId={areaId}
                    />
                </div>
            );
        }
    }

    return <h1>{params.id}</h1>;
};

export default OpenSessionPage;
