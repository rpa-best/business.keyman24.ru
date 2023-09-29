'use client';

import React, {
    useState,
    createContext,
    useEffect,
    useRef,
    useMemo,
    memo,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { IHeader, ITableContext, TableProps } from 'components/Table/types';
import { Paginator } from 'components/Table/Paginator';
import { ColumnHeader } from 'components/Table/ColumnHeader';
import { useResizeWidth } from 'hooks/useResizeWidth';
import { Row } from 'components/Table/Row/Row';
import clsx from 'clsx';
import { setSortedData } from 'components/Table/utils/setSortedData';

import scss from './Table.module.scss';
import { Spinner } from 'components/Spinner';

export const TableContext = createContext<ITableContext | null>(null);

export const Table = memo(function MemoTable({
    tableRows,
    handleRowClick,
    children,
    paginatorData,
    rowClickable = true,
    buttonData,
    handleEditClick,
    handleDeleteClick,
    stopPropagation,
}: TableProps) {
    const [loading, setLoading] = useState(false);
    const [headers, setHeaders] = useState<IHeader[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedField, setSortedField] = useState<string>('');
    const [tableData, setTableData] = useState(tableRows);

    const router = useRouter();

    const pathname = usePathname();

    const totalPages = paginatorData
        ? Math.ceil(paginatorData?.countItems / paginatorData.offset)
        : null;

    const headerClickCount = useRef<number>(1);
    const headerRef = useRef<HTMLDivElement>(null);

    const memoizedHeaders = useMemo(() => headers, [headers]);

    const { tabletBreak } = useResizeWidth();

    useEffect(() => {
        setTableData(tableRows);
    }, [tableRows]);

    const handlePaginatorClick = (page: number) => {
        setCurrentPage(page);
        paginatorData &&
            router.replace(
                `${pathname}/?offset=${(page - 1) * paginatorData?.offset}`
            );
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 200);
    };

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
                            className={scss.table_body}
                        >
                            {tableData.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => onRowClick(item.id)}
                                        key={index}
                                        className={rowClassName}
                                    >
                                        <Row
                                            stopPropagation={stopPropagation}
                                            handleDeleteClick={
                                                handleDeleteClick
                                            }
                                            handleEditClick={handleEditClick}
                                            headers={headers}
                                            key={index}
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
                        countPages={totalPages as number}
                        currentPage={currentPage}
                        handlePaginatorClick={handlePaginatorClick}
                    />
                )}
            </div>
            {paginatorData && tabletBreak && (
                <Paginator
                    countPages={totalPages as number}
                    currentPage={currentPage}
                    handlePaginatorClick={handlePaginatorClick}
                />
            )}
            {loading && <Spinner />}
        </div>
    );
});
