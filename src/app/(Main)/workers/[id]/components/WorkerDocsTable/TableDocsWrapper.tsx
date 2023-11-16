import React, { useMemo } from 'react';

import { IWorkerDocs } from 'http/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { ModifiedWorkerDocs } from 'app/(Main)/workers/[id]/components/WorkerTables/WorkerTables';

interface TableDocsWrapperProps {
    data: ModifiedWorkerDocs[] | null;
}

export const TableDocsWrapper: React.FC<TableDocsWrapperProps> = ({ data }) => {
    const notValidIds = useMemo(() => {
        return data
            ?.filter((el) => {
                return validateDate(el.activeTo);
            })
            .map((el) => el.id);
    }, [data]);

    if (!data) {
        return null;
    }
    return (
        <Table
            errorRowIds={notValidIds}
            tableData={data}
            setTableData={() => {}}
        >
            <Column header="Наименование" field="name" />
            <Column header="Дата начала" field="formattedActiveFrom" />
            <Column header="Дата окончания" field="formattedActiveTo" />
        </Table>
    );
};
