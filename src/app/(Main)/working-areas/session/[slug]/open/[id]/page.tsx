import React from 'react';
import { cookies } from 'next/headers';

import { Inventory } from 'app/(Main)/working-areas/session/[slug]/open/components/Inventory';
import { Key } from 'app/(Main)/working-areas/session/[slug]/open/components/Key';
import { Register } from 'app/(Main)/working-areas/session/[slug]/open/components/Register';
import { RegisterInventory } from 'app/(Main)/working-areas/session/[slug]/open/components/RegisterInventory';
import { Security } from 'app/(Main)/working-areas/session/[slug]/open/components/Security';
import { getWorkingAreas } from 'http/workingAreaApi';

import scss from './OpenSession.module.scss';
import { getOrganizations } from 'http/organizationApi';

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
            return <Key />;
        }
        case 'register': {
            return (
                <div className={scss.children_with_table}>
                    <h1 className={scss.page_title_with_table}>{area?.name}</h1>
                    <Register organizations={organizations} />
                </div>
            );
        }
        case 'register_inventory': {
            return <RegisterInventory />;
        }
        case 'security': {
            return <Security />;
        }
    }

    return <h1>{params.id}</h1>;
};

export default OpenSessionPage;
