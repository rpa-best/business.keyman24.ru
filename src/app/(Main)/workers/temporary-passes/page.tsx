import { TemporaryWorkerForm } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/TemporaryWorkerForm';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { getServerWorkers } from 'http/workerApi';
import { cookies } from 'next/headers';

import scss from './temporary-passess.module.scss';
import { BackButton } from 'components/UI/Buttons/BackButton';

export default async function TemporaryPasses({
    searchParams,
}: {
    searchParams: { offset: string };
}) {
    const cookie = cookies();
    const orgId = cookie.get('orgId')?.value as string;

    const offset = searchParams.offset ?? '0';

    const tempWorkers = await getServerWorkers(+orgId, offset, true);

    return (
        <section className={scss.children_with_table}>
            <div className={scss.page_title_with_table_back_button}>
                <h1>Временные гости</h1>
                <BackButton>Назад</BackButton>
            </div>

            <TemporaryWorkerForm tempWorkers={tempWorkers.results as any} />
            <Table
                paginatorData={{ offset: 15, countItems: tempWorkers.count }}
                tableData={tempWorkers.results}
                setTableData={null as any}
            >
                <Column header="ФИО" field="name" />
                <Column header="Описание" field="desc" />
            </Table>
        </section>
    );
}
