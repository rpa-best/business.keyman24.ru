'use client';
import React, { useState } from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { TableDocsWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableDocsWrapper';
import { TableCardWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableCardWrapper';
import { TableInventoryWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableInventoryWrapper';
import { WorkerTimeTable } from 'app/(Main)/workers/[id]/components/WorkerTimeTable';
import { ICard, IInventory, IWorkerDocs, IWorkerPlan } from 'http/types';

import scss from 'app/(Main)/workers/[id]/components/WorkerDocsTable/WorkerDocsTable.module.scss';
import { IModifiedInventory } from 'app/(Main)/inventory/types';

interface WorkerTablesProps {
    cards: ICard[];
    docs: IWorkerDocs[];
    workerInventory: IModifiedInventory[];
    time: IWorkerPlan;
}

export const WorkerTables: React.FC<WorkerTablesProps> = ({
    workerInventory,
    time,
    docs,
    cards,
}) => {
    const [which, setWhich] = useState<'docs' | 'card' | 'inventory' | 'time'>(
        'docs'
    );

    return (
        <>
            <div className={scss.buttons_wrapper}>
                <div className={scss.button}>
                    <Button
                        onClick={() => {
                            setWhich('docs');
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
                            setWhich('card');
                        }}
                        active={which === 'card'}
                        type="button"
                    >
                        Выданные карты
                    </Button>
                </div>
                <div className={scss.button}>
                    <Button
                        onClick={() => setWhich('inventory')}
                        active={which === 'inventory'}
                        type="button"
                    >
                        Инвентарь / ключи
                    </Button>
                </div>
                <div className={scss.button}>
                    <Button
                        onClick={() => setWhich('time')}
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
            {which === 'time' && <WorkerTimeTable data={time} />}
        </>
    );
};
