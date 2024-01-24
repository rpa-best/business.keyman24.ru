import React, { useMemo, useState } from 'react';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { validateDate } from 'app/(Main)/working-areas/session/[slug]/open/OpenSession.utils';
import { ModifiedWorkerDocs } from 'app/(Main)/workers/[id]/components/WorkerTables/WorkerTables';
import { Modal } from 'components/Modal';
import { AddWorkerDocumentForm } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/AddWorkerDocumentForm/AddWorkerDocumentForm';
import { useParams } from 'next/navigation';

interface TableDocsWrapperProps {
    data: ModifiedWorkerDocs[] | null;
}

export const TableDocsWrapper: React.FC<TableDocsWrapperProps> = ({ data }) => {
    const [visible, setVisible] = useState(false);
    const params = useParams();

    const workerId = params.id;

    const [tableData, setTableData] = useState<ModifiedWorkerDocs[]>(
        data as ModifiedWorkerDocs[]
    );

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
        <>
            <Table
                errorRowIds={notValidIds}
                tableData={tableData}
                rowClickable={false}
                buttonData={{
                    onClick: () => setVisible(true),
                    text: 'Добавить',
                }}
                setTableData={() => {}}
            >
                <Column header="Наименование" field="name" />
                <Column header="Дата начала" field="formattedActiveFrom" />
                <Column header="Дата окончания" field="formattedActiveTo" />
            </Table>
            <Modal customSetVisible={setVisible} customVisible={visible}>
                <AddWorkerDocumentForm
                    setVisible={setVisible}
                    setTableData={setTableData}
                    id={workerId}
                />
            </Modal>
        </>
    );
};
