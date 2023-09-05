'use client';

import React, { useState } from 'react';
import { ICard, IInventory, IWorkerDocs } from 'http/types';

import { TableDocsWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableDocsWrapper';
import { TableCardWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableCardWrapper';
import { Button } from 'components/UI/Buttons/Button';
import { TableInventoryWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableInventoryWrapper';

import scss from './WorkerDocsTable.module.scss';

export interface WorkerInventoryType extends Omit<IInventory, 'type'> {
    type: string;
}

interface WorkerDocsTableProps {
    cards: ICard[];
    docs: IWorkerDocs[];
    workerInventory: WorkerInventoryType[];
}

export const WorkerDocsTable: React.FC<WorkerDocsTableProps> = ({
    cards,
    docs,
    workerInventory,
}) => {
    const [which, setWhich] = useState<'docs' | 'card' | 'inventory'>('docs');

    return (
        <div className={scss.info_wrapper}>
            <div className={scss.buttons_wrapper}>
                <Button
                    onClick={() => {
                        setWhich('docs');
                    }}
                    active={which === 'docs'}
                    type="button"
                >
                    Документы
                </Button>
                <Button
                    onClick={() => {
                        setWhich('card');
                    }}
                    active={which === 'card'}
                    type="button"
                >
                    Выданные карты
                </Button>
                <Button
                    onClick={() => setWhich('inventory')}
                    active={which === 'inventory'}
                    type="button"
                >
                    Инвентарь / ключи
                </Button>
            </div>
            {which === 'docs' && <TableDocsWrapper data={docs} />}
            {which === 'card' && <TableCardWrapper data={cards} />}
            {which === 'inventory' && (
                <TableInventoryWrapper inventory={workerInventory} />
            )}
        </div>
    );
};
