'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import { ColumnProps } from 'components/Table/types';
import { Table } from 'components/Table';
import { IResponse, IWorker } from 'http/types';
import { deleteWorker } from 'http/workerApi';
import { Spinner } from 'components/Spinner';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { errorToastOptions } from 'config/toastConfig';
import GuestWorkersSvg from '/public/svg/guestworkers.svg';

interface TemporaryPassesTableWrapper {
    tempWorkers: IResponse<IWorker>;
    children: ReactElement<ColumnProps> | Array<ReactElement<ColumnProps>>;
}

export const TemporaryPassesTableWrapper: FC<TemporaryPassesTableWrapper> = ({
    children,
    tempWorkers,
}) => {
    const [currentTableData, setCurrentTableData] = useState(
        tempWorkers.results
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCurrentTableData(tempWorkers.results);
    }, [tempWorkers.results]);
    const handleDeleteClick = async (id: number) => {
        setLoading(true);
        try {
            return await deleteWorker(id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Table
                iconProperties={{
                    column: 1,
                    svg: GuestWorkersSvg,
                    condition: (item) => item.lcId,
                    title: 'Работник с Капитал Кадров',
                }}
                deleteConfirmProps={{
                    text: 'Вы уверены, что хотите удалить работника?',
                }}
                handleDeleteClick={handleDeleteClick}
                paginatorData={{ offset: 15, countItems: tempWorkers.count }}
                tableData={currentTableData}
                setTableData={setCurrentTableData}
            >
                {children}
            </Table>
            {loading && <Spinner />}
        </>
    );
};
