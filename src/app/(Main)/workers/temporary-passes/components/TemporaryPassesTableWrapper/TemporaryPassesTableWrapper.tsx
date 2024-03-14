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
            await deleteWorker(id);
        } catch (e) {
            if (e instanceof AxiosError) {
                toast(e.response?.data.error[0].name, errorToastOptions);
            }
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Table
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
