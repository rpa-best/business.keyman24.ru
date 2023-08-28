import React from 'react';
import { cookies } from 'next/headers';

import { getLocationObjects } from 'http/locationsApi';
import { Column } from 'components/Table/Column';
import { Table } from 'components/Table';

import scss from 'app/(Main)/keys/keys.module.scss';
import { TableWrapper } from 'app/(Main)/keys/components/TableWrapper';

interface LocationObjectsPageProps {
    params: { locId: string };
}

const LocationObjectsPage: React.FC<LocationObjectsPageProps> = async ({
    params: { locId },
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const objects = await getLocationObjects(+orgId, +locId);

    const modifiedObjects = objects.results.map((l) => {
        return { ...l, desc: l.desc ?? '-' };
    });

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Локации</h2>
            <TableWrapper tableRows={modifiedObjects}>
                <Column header="Наименование" field="name" />
                <Column header="Описание" field="desc" />
            </TableWrapper>
        </div>
    );
};

export default LocationObjectsPage;
