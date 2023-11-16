'use client';

import React, { useEffect } from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { TableDocsWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableDocsWrapper';
import { TableCardWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableCardWrapper';
import { TableInventoryWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableInventoryWrapper';
import { WorkerTimeTable } from 'app/(Main)/workers/[id]/components/WorkerTimeTable';
import { ICard, IWorkerDocs, IWorkerPlan } from 'http/types';
import { IModifiedInventory } from 'app/(Main)/inventory/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import scss from 'app/(Main)/workers/[id]/components/WorkerDocsTable/WorkerDocsTable.module.scss';

export interface ModifiedWorkerDocs extends IWorkerDocs {
    formattedActiveTo: string;
    formattedActiveFrom: string;
}

interface WorkerTablesProps {
    cards: ICard[] | null;
    docs: ModifiedWorkerDocs[] | null;
    workerInventory: IModifiedInventory[] | null;
    time: IWorkerPlan | null;
}

const availableParams = ['card', 'inventory', 'time', 'docs'];

export const WorkerTables: React.FC<WorkerTablesProps> = ({
    workerInventory,
    time,
    docs,
    cards,
}) => {
    const params = useSearchParams();
    const router = useRouter();
    const path = usePathname();

    const which = params.get('which');

    useEffect(() => {
        for (const elem of availableParams) {
            router.prefetch(path + `?which=${elem}`);
        }
    }, []);

    return (
        <>
            <div className={scss.buttons_wrapper}>
                <div className={scss.button}>
                    <Button
                        onClick={() => {
                            router.replace(path + '?which=docs', {
                                scroll: false,
                            });
                        }}
                        active={which === 'docs'}
                        type="button"
                    >
                        Документы
                    </Button>
                </div>
                <div className={scss.button}>
                    <Button
                        onClick={() => {
                            router.replace(path + '?which=card', {
                                scroll: false,
                            });
                        }}
                        active={which === 'card'}
                        type="button"
                    >
                        Выданные карты
                    </Button>
                </div>
                <div className={scss.button}>
                    <Button
                        onClick={() => {
                            router.replace(path + '?which=inventory', {
                                scroll: false,
                            });
                        }}
                        active={which === 'inventory'}
                        type="button"
                    >
                        Инвентарь / ключи
                    </Button>
                </div>
                <div className={scss.button}>
                    <Button
                        onClick={() => {
                            router.replace(path + '?which=time', {
                                scroll: false,
                            });
                        }}
                        active={which === 'time'}
                        type="button"
                    >
                        Учёт времени
                    </Button>
                </div>
            </div>
            {which === 'docs' && <TableDocsWrapper data={docs} />}
            {which === 'card' && <TableCardWrapper data={cards} />}
            {which === 'inventory' && (
                <TableInventoryWrapper inventory={workerInventory} />
            )}
            {which === 'time' && <WorkerTimeTable data={time as IWorkerPlan} />}
        </>
    );
};
