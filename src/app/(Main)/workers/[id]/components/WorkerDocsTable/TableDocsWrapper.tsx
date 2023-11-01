import React, { useMemo } from 'react';

import { IWorkerDocs } from 'http/types';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';

interface TableDocsWrapperProps {
    data: IWorkerDocs[] | null;
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
            <Column header="Дата начала" field="activeFrom" />
            <Column header="Дата окончания" field="activeTo" />
        </Table>
    );
};
