import React from 'react';
import { cookies } from 'next/headers';

import { Column } from 'components/Table/Column';
import { getLocations } from 'http/locationsApi';
import { TableWrapper } from 'app/(Main)/locations/components/TableWrapper';

import scss from 'app/(Main)/locations/locations.module.scss';
import { getOrganizationContractors } from 'http/organizationApi';

const LocationsPage = async () => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const locations = await getLocations(+orgId);

    const organizations = await getOrganizationContractors(+orgId);

    const modifiedLocations = locations.results.map((l) => {
        return { ...l, desc: l.desc ?? '-' };
    });

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Локации</h2>
            <TableWrapper
                organizations={organizations}
                path="objects"
                tableRows={modifiedLocations}
            >
                <Column header="Наименование" field="name" />
                <Column header="Описание" field="desc" />
            </TableWrapper>
        </div>
    );
};

export default LocationsPage;
