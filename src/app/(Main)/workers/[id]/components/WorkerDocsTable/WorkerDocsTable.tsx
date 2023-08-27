'use client';

import React from 'react';
import { ICard, IWorkerDocs } from 'http/types';

import scss from './WorkerDocsTable.module.scss';
import { usePathname, useRouter } from 'next/navigation';
import { Table } from 'components/Table';
import { Column } from 'components/Table/Column';
import { TableDocsWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableDocsWrapper';
import { TableCardWrapper } from 'app/(Main)/workers/[id]/components/WorkerDocsTable/TableCardWrapper';
import clsx from 'clsx';

interface WorkerDocsTableProps {
    info: ICard[] | IWorkerDocs[];
    searchParams: 'docs' | 'card';
}

export const WorkerDocsTable: React.FC<WorkerDocsTableProps> = ({
    info,
    searchParams,
}) => {
    const docs = searchParams === 'docs';

    const router = useRouter();
    const pathname = usePathname();

    const handleButtonClick = (searchParams: 'card' | 'docs') => {
        router.replace(`${pathname}/?which=${searchParams}`, { scroll: false });
    };

    return (
        <div className={scss.info_wrapper}>
            <div className={scss.buttons_wrapper}>
                <button
                    onClick={() => handleButtonClick('card')}
                    className={docs ? scss.button : scss.button_active}
                >
                    Выданные карты
                </button>
                <button
                    onClick={() => handleButtonClick('docs')}
                    className={docs ? scss.button_active : scss.button}
                >
                    Документы
                </button>
            </div>
            {docs ? (
                <TableDocsWrapper data={info as IWorkerDocs[]} />
            ) : (
                <TableCardWrapper data={info as ICard[]} />
            )}
        </div>
    );
};
