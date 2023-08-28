'use client';

import React, { useContext, useEffect, useState } from 'react';

import { TableContext } from 'components/Table/Table';
import { ColumnProps, ITableContext } from 'components/Table/types';
import { Spinner } from 'components/Spinner';

export const Column: React.FC<ColumnProps> = ({
    header,
    field,
    sortable = false,
}) => {
    const [loading, setLoading] = useState(true);
    const { setHeaders } = useContext<ITableContext | null>(
        TableContext
    ) as ITableContext;

    useEffect(() => {
        setLoading(false);
    }, [setHeaders]);

    useEffect(() => {
        setHeaders((prevHeaders) => {
            const currentHeader = { sortable, field: field, name: header };
            if (prevHeaders.some((h) => h.name === header)) {
                return prevHeaders;
            }

            return [...prevHeaders, currentHeader];
        });
    }, [field, header, setHeaders, sortable]);

    return loading && <Spinner />;
};
