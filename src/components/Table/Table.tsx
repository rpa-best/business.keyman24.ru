'use client';

import React, {
    useState,
    createContext,
    useEffect,
    useRef,
    useMemo,
    memo,
} from 'react';

import { IHeader, ITableContext, TableProps } from 'components/Table/types';
import { Paginator } from 'components/Table/Paginator';
import { ColumnHeader } from 'components/Table/ColumnHeader';
import { useResizeWidth } from 'hooks/useResizeWidth';
import { Row } from 'components/Table/Row/Row';
import clsx from 'clsx';
import { setSortedData } from 'components/Table/utils/setSortedData';
import { Spinner } from 'components/Spinner';

import scss from './Table.module.scss';
import { useSearchParams } from 'next/navigation';

export const TableContext = createContext<ITableContext | null>(null);

export const Table = memo(function MemoTable({
    tableData,
    setTableData,
    handleRowClick,
    children,
    paginatorData,
    rowClickable = true,
    buttonData,
    handleEditClick,
    handleDeleteClick,
    stopPropagation,
    errorRowIds = [],
    prefetch,
    iconProperties,
    height,
    deleteConfirmProps,
}: TableProps) {
    const searchParams = useSearchParams();

    const [headers, setHeaders] = useState<IHeader[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedField, setSortedField] = useState<string>('');
    const totalPages = useMemo(() => {
        return paginatorData
            ? Math.ceil(paginatorData?.countItems / paginatorData.offset)
            : null;
    }, [paginatorData]);

    const headerClickCount = useRef<number>(1);
    const headerRef = useRef<HTMLDivElement>(null);

    const [prefetchedRows, setPrefetchedRows] = useState<number[]>();

    const memoizedHeaders = useMemo(() => headers, [headers]);

    const { tabletBreak } = useResizeWidth();

    const handlePaginatorClick = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const offset = searchParams.get('offset');
        if (offset && paginatorData?.offset) {
            if (+offset === 0) {
                return;
            }
            setCurrentPage(+offset / paginatorData?.offset + 1);
        }
    }, []);

    useEffect(() => {
        if (prefetch && tableData) {
            for (const elem of tableData) {
                prefetch(elem.id);
            }
            setPrefetchedRows(tableData.map((el) => el.id));
        }
    }, []);

    useEffect(() => {
        const newTableRow = tableData.find(
            (el) => !prefetchedRows?.includes(el.id)
        );

        if (newTableRow) {
            if (prefetch) {
                prefetch(newTableRow.id);
            }
        }
    }, [prefetch, tableData]);

    const sortTableData = (field: string) => {
        if (field === sortedField) {
            if (headerClickCount.current % 2 === 1) {
                setSortedData('ASC', field, setTableData);
            } else {
                setSortedData('DESC', field, setTableData);
            }
            headerClickCount.current++;
            return;
        }
        setSortedField(field);
        headerClickCount.current = 1;
        setSortedData('DESC', field, setTableData);
    };

    const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        headerRef.current
            ? (headerRef.current.scrollLeft = e.currentTarget.scrollLeft)
            : undefined;
    };

    const onRowClick = (id: number) => {
        handleRowClick ? handleRowClick(id) : null;
    };

    const tableClassName = clsx({
        [scss.table_scrollbar_layout]: true,
        [scss.table_more_then_3]:
            tabletBreak && (headers.length > 3 || headers.length < 3),
    });

    const rowClassName = clsx({
        [scss.table_row]: true,
        [scss.table_row_clickable]: rowClickable,
    });

    return (
        <div className={scss.table_layout}>
            <div className={tableClassName}>
                <div className={scss.table}>
                    <div ref={headerRef} className={scss.table_headers}>
                        {memoizedHeaders.map((head, index) => {
                            const lastChild = headers.length === index + 1;
                            return (
                                <ColumnHeader
                                    stopPropagation={stopPropagation}
                                    headersCount={headers.length}
                                    key={index}
                                    buttonData={buttonData}
                                    lastChild={lastChild}
                                    sortTableData={sortTableData}
                                    sortedField={sortedField}
                                    {...head}
                                />
                            );
                        })}
                    </div>
                    <TableContext.Provider
                        value={{
                            setHeaders,
                        }}
                    >
                        <div
                            onScroll={handleBodyScroll}
                            style={{ height }}
                            className={scss.table_body}
                        >
                            {tableData.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => onRowClick(item.id)}
                                        key={index}
                                        style={{
                                            background: errorRowIds.includes(
                                                item.id
                                            )
                                                ? '#A13535'
                                                : undefined,
                                        }}
                                        className={rowClassName}
                                    >
                                        <Row
                                            iconProperties={iconProperties}
                                            stopPropagation={stopPropagation}
                                            handleDeleteClick={
                                                handleDeleteClick
                                            }
                                            deleteConfirmProps={
                                                deleteConfirmProps
                                            }
                                            setTableData={setTableData}
                                            handleEditClick={handleEditClick}
                                            headers={headers}
                                            item={item}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {children}
                    </TableContext.Provider>
                </div>
                {paginatorData && !tabletBreak && (
                    <Paginator
                        offset={paginatorData.offset}
                        countPages={totalPages as number}
                        currentPage={currentPage}
                        handlePaginatorClick={handlePaginatorClick}
                    />
                )}
            </div>
            {paginatorData && tabletBreak && (
                <Paginator
                    offset={paginatorData.offset}
                    countPages={totalPages as number}
                    currentPage={currentPage}
                    handlePaginatorClick={handlePaginatorClick}
                />
            )}
        </div>
    );
});
