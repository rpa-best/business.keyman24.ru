import { TemporaryWorkerForm } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/TemporaryWorkerForm';

import scss from './temporary-passess.module.scss';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { getServerQrcodes, getServerWorkers } from 'http/workerApi';
import { cookies } from 'next/headers';

export default async function TemporaryPasses({
    searchParams,
}: {
    searchParams: { offset: string };
}) {
    const cookie = cookies();
    const orgId = cookie.get('orgId')?.value as string;

    const offset = searchParams.offset ?? '0';

    const tempWorkers = await getServerWorkers(+orgId, offset, true);

    const qrCodes = await Promise.all(
        tempWorkers.results.map(async (el) => {
            return await getServerQrcodes(+orgId, el.id);
        })
    );

    const tempWorkersWithEndDate = tempWorkers.results.map((el, index) => {
        return {
            ...el,
            endDate: qrCodes[index].results[0]?.endDate.slice(0, 10),
        };
    });

    return (
        <section className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Временные пропуска</h2>
            <TemporaryWorkerForm tempWorkers={tempWorkersWithEndDate} />
            <Table
                paginatorData={{ offset: 15, countItems: tempWorkers.count }}
                tableData={tempWorkersWithEndDate}
                setTableData={null as any}
            >
                <Column header="ФИО" field="name" />
                <Column header="Срок действия" field="endDate" />
            </Table>
        </section>
    );
}
