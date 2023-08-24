import React from 'react';
import { TableRows } from 'components/Table/types';

type SetSortedDataType = (
    sort: 'ASC' | 'DESC',
    field: string,
    setTableData: React.Dispatch<React.SetStateAction<TableRows[]>>
) => void;

export const setSortedData: SetSortedDataType = (sort, field, setTableData) => {
    setTableData((data) =>
        [...data].sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];
            if (sort === 'ASC') {
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return valueA.localeCompare(valueB);
                }

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return valueA - valueB;
                }

                return 0;
            } else {
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return valueB.localeCompare(valueA);
                }

                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return valueB - valueA;
                }

                return 0;
            }
        })
    );
};
