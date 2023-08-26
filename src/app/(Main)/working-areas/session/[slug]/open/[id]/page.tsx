import React from 'react';
import { cookies } from 'next/headers';

import { Inventory } from 'app/(Main)/working-areas/session/[slug]/open/components/Inventory';
import { Key } from 'app/(Main)/working-areas/session/[slug]/open/components/Key';
import { Register } from 'app/(Main)/working-areas/session/[slug]/open/components/Register';
import { Security } from 'app/(Main)/working-areas/session/[slug]/open/components/Security';
import { getWorkingAreas } from 'http/workingAreaApi';
import { getOrganizations } from 'http/organizationApi';

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

    switch (params.slug) {
        case 'inventory': {
            return <Inventory />;
        }
        case 'key': {
            return (
                <div className={scss.children_with_table}>
                    <h1 className={scss.page_title_with_table}>{area?.name}</h1>
                    <Key
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
                    <h1 className={scss.page_title_with_table}>{area?.name}</h1>
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
                    <h1 className={scss.page_title_with_table}>{area?.name}</h1>
                    <Security
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
