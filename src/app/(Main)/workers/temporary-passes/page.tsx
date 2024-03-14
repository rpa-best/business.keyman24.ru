import { TemporaryWorkerForm } from 'app/(Main)/workers/temporary-passes/components/TemporaryWorkerForm/TemporaryWorkerForm';

import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { getServerWorkers } from 'http/workerApi';
import { cookies } from 'next/headers';

import { BackButton } from 'components/UI/Buttons/BackButton';
import { ShowGuestButton } from 'app/(Main)/workers/temporary-passes/components/ShowGuestsButton';

import scss from './temporary-passess.module.scss';
import { TemporaryPassesTableWrapper } from 'app/(Main)/workers/temporary-passes/components/TemporaryPassesTableWrapper';

export default async function TemporaryPasses({
    searchParams,
}: {
    searchParams: { offset: string; guest: string };
}) {
    const cookie = cookies();
    const orgId = cookie.get('orgId')?.value as string;

    const guest = searchParams.guest ?? false;
    const offset = searchParams.offset ?? '0';

    const tempWorkers = await getServerWorkers(+orgId, offset, Boolean(guest));

    return (
        <section className={scss.children_with_table}>
            <div className={scss.page_title_with_table_back_button}>
                <h1>Создание работника</h1>
                <BackButton>Назад</BackButton>
            </div>

            <TemporaryWorkerForm tempWorkers={tempWorkers.results as any} />
            <ShowGuestButton />
            <TemporaryPassesTableWrapper tempWorkers={tempWorkers}>
                <Column header="ФИО" field="name" />
                <Column header="Описание" field="desc" />
            </TemporaryPassesTableWrapper>
        </section>
    );
}
