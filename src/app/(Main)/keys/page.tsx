import React from 'react';
import { cookies } from 'next/headers';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { getLocations } from 'http/locationsApi';

import scss from './keys.module.scss';
import { useRouter } from 'next/navigation';
import { TableWrapper } from 'app/(Main)/keys/components/TableWrapper';

const KeysPage = async () => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value ?? 1;

    const locations = await getLocations(+orgId);

    const modifiedLocations = locations.results.map((l) => {
        return { ...l, desc: l.desc ?? '-' };
    });

    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Локации</h2>
            <TableWrapper path={'objects'} tableRows={modifiedLocations}>
                <Column header="Наименование" field="name" />
                <Column header="Описание" field="desc" />
            </TableWrapper>
        </div>
    );
};

export default KeysPage;
