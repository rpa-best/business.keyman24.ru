import React from 'react';
import { cookies } from 'next/headers';

import { getSessionLog, getWorkingAreas } from 'http/workingAreaApi';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';

import scss from './ClosedPage.module.scss';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';

interface ClosedSessionProps {
    params: { id: string; slug: string };
}

const ClosedSessionPage: React.FC<ClosedSessionProps> = async ({ params }) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value ?? 1;
    const workingAreas = await getWorkingAreas(+orgId);

    const area = workingAreas.results.find(
        (area) => area.id === +getParamsId(params.slug)
    );

    const inventoryOrKeys =
        getParamsType(params.slug) === 'inventory' ||
        getParamsType(params.slug) === 'key';

    const sessionLog = await getSessionLog(
        +orgId,
        area?.id as number,
        +params.id
    );

    const modifiedLog = sessionLog.results.map((s) => {
        let mode;
        if (getParamsType(params.slug) !== 'security') {
            mode = s.mode ? 'Получен' : 'Сдан';
        } else {
            mode = s.mode ? 'Зашёл' : 'Вышел';
        }
        return {
            ...s,
            workerName: s.worker.name,
            mode: mode,
            itemName: `${s?.inventory?.id} ${s?.inventory?.name}`,
        };
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.page_title_with_table}>
                <BackButton skipWord>Назад</BackButton>
            </div>
            {modifiedLog.length !== 0 ? (
                <Table tableRows={modifiedLog}>
                    <Column header="Работник" field="workerName" />
                    <Column sortable header="Дата" field="date" />
                    <Column sortable header="Событие" field="mode" />
                    {inventoryOrKeys &&
                        ((
                            <Column
                                sortable
                                header="Наименование"
                                field="itemName"
                            />
                        ) as any)}
                </Table>
            ) : (
                <h2 className={scss.empty}>
                    В этой сессии ничего не происходило
                </h2>
            )}
        </div>
    );
};

export default ClosedSessionPage;
