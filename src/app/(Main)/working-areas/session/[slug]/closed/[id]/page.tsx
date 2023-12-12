import React from 'react';
import { cookies } from 'next/headers';

import {
    getSessionLog,
    getWorkingArea,
    getWorkingAreas,
} from 'http/workingAreaApi';
import { Column } from 'components/Table/Column';
import { BackButton } from 'components/UI/Buttons/BackButton';
import { getParamsId, getParamsType } from 'app/(Main)/working-areas/helpers';

import scss from './ClosedPage.module.scss';
import { TableWrapper } from 'app/(Main)/working-areas/session/[slug]/closed/[id]/TableWrapper';

interface ClosedSessionProps {
    params: { id: string; slug: string };
    searchParams: { offset: string };
}

const ClosedSessionPage: React.FC<ClosedSessionProps> = async ({
    params,
    searchParams,
}) => {
    const cookieStore = cookies();
    const orgId = cookieStore.get('orgId')?.value as string;

    const areaId = +getParamsId(params.slug);

    const area = await getWorkingArea(+orgId, areaId);

    const offset = searchParams.offset ?? '0';

    const inventoryOrKeys =
        getParamsType(params.slug) === 'inventory' ||
        getParamsType(params.slug) === 'key';

    const inventory = getParamsType(params.slug) === 'inventory';

    const itsSecurity = getParamsType(params.slug) === 'security';

    const itsRegisterInventory =
        getParamsType(params.slug) === 'register_inventory';

    const sessionLog = await getSessionLog(
        +orgId,
        area?.id as number,
        +params.id,
        offset
    );

    const modifiedLog = sessionLog.results.map((s) => {
        const itemName = itsSecurity
            ? null
            : inventoryOrKeys
            ? `${s?.inventory?.id} ${s?.inventory?.name}, ${
                  inventory
                      ? s.inventory.location.name
                      : s.inventory?.objectArea?.name
              }`
            : itsRegisterInventory
            ? `${s?.inventory?.id} ${s?.inventory?.name}`
            : `Карта №${s.card}`;

        let mode;
        if (itsSecurity) {
            mode = s.mode ? 'Зашёл' : 'Вышел';
        } else if (itsRegisterInventory) {
            mode = s.mode ? 'Зарегестрирован' : 'Сдан';
        } else {
            mode = s.mode ? 'Получен' : 'Сдан';
        }
        return {
            ...s,
            workerName: s?.worker?.name,
            mode: mode,
            itemName,
        };
    });

    return (
        <div className={scss.children_with_table}>
            <div className={scss.page_title_with_table}>
                <BackButton skipWord>Назад</BackButton>
            </div>
            {modifiedLog.length !== 0 ? (
                <TableWrapper count={sessionLog.count} tableRows={modifiedLog}>
                    {!itsRegisterInventory && (
                        <Column header="Работник" field="workerName" />
                    )}
                    <Column sortable header="Дата" field="date" />
                    {itsRegisterInventory && (
                        <Column header="Инвентарь" field="itemName" />
                    )}
                    <Column sortable header="Событие" field="mode" />
                    {!itsSecurity && !itsRegisterInventory ? (
                        <Column
                            sortable
                            header="Наименование"
                            field="itemName"
                        />
                    ) : (
                        (null as any)
                    )}
                </TableWrapper>
            ) : (
                <h2 className={scss.empty}>
                    В этой сессии ничего не происходило
                </h2>
            )}
        </div>
    );
};

export default ClosedSessionPage;
