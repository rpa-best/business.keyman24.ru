import React from 'react';
import { cookies } from 'next/headers';

import { Column } from 'components/Table/Column';
import { getLocations } from 'http/locationsApi';
import { getOrganizationContractors } from 'http/organizationApi';
import { TableWrapper } from 'app/(Main)/locations/components/TableWrapper';

import scss from 'app/(Main)/locations/locations.module.scss';

interface LocationPageProps {
    searchParams: { offset: string };
}

const LocationsPage = async ({ searchParams }: LocationPageProps) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const offset = searchParams.offset ?? '0';

    const locations = await getLocations(+orgId, offset);

    const organizations = await getOrganizationContractors(+orgId);

    const modifiedLocations = locations.results.map((l) => {
        return { ...l, desc: l.desc ?? '-' };
    });

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Локации</h2>
            <TableWrapper
                count={locations.count}
                allowedPermissions={locations.permissions}
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
