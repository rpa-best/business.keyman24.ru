'use client';

import React, { useState } from 'react';
import { ICard, IInventory, IWorkerDocs, IWorkerPlan } from 'http/types';

import { TableDocsWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableDocsWrapper';
import { TableCardWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableCardWrapper';
import { Button } from 'components/UI/Buttons/Button';
import { TableInventoryWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableInventoryWrapper';

import scss from './WorkerDocsTable.module.scss';
import { WorkerTimeTable } from 'app/(Main)/workers/[id]/components/WorkerTimeTable';

export interface WorkerInventoryType extends Omit<IInventory, 'type'> {
    type: string;
}

interface WorkerDocsTableProps {
    cards: ICard[];
    docs: IWorkerDocs[];
    workerInventory: WorkerInventoryType[];
    time: IWorkerPlan;
}

export const WorkerDocsTable: React.FC<WorkerDocsTableProps> = ({
    cards,
    docs,
    workerInventory,
    time,
}) => {
    const [which, setWhich] = useState<'docs' | 'card' | 'inventory' | 'time'>(
        'docs'
    );

    return (
        <div className={scss.info_wrapper}>
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
        </div>
    );
};
