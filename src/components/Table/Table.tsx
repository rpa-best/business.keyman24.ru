import React, {
    useState,
    createContext,
    useEffect,
    useRef,
    useMemo,
} from 'react';

import { IHeader, ITableContext, TableProps } from 'components/Table/types';
import { Paginator } from 'components/Table/Paginator';
import { ColumnHeader } from 'components/Table/ColumnHeader';
import { useResizeWidth } from 'hooks/useResizeWidth';
import { Row } from 'components/Table/Row/Row';
import clsx from 'clsx';
import { setSortedData } from 'components/Table/utils/setSortedData';

import scss from './Table.module.scss';

export const TableContext = createContext<ITableContext | null>(null);

export const Table: React.FC<TableProps> = ({
    tableRows,
    handleRowClick,
    children,
    paginator,
    rowClickable = true,
    buttonData,
    handleEditClick,
    handleDeleteClick,
}) => {
    const headerClickCount = useRef<number>(1);
    const [headers, setHeaders] = useState<IHeader[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedField, setSortedField] = useState<string>('');
    const [tableData, setTableData] = useState(tableRows);

    const memoizedHeaders = useMemo(() => headers, [headers]);
    const memoizedTableData = useMemo(() => tableData, [tableData]);

    const { tabletBreak } = useResizeWidth();

    useEffect(() => {
        setTableData(tableRows);
    }, [tableRows]);

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
                    <div className={scss.table_headers}>
                        {memoizedHeaders.map((head, index) => {
                            const lastChild = headers.length === index + 1;
                            return (
                                <ColumnHeader
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
                        <div className={scss.table_body}>
                            {memoizedTableData.map((item, index) => (
                                <div
                                    onClick={() => onRowClick(item.id)}
                                    key={index}
                                    className={rowClassName}
                                >
                                    <Row
                                        handleDeleteClick={handleDeleteClick}
                                        handleEditClick={handleEditClick}
                                        headers={headers}
                                        key={index}
                                        item={item}
                                    />
                                </div>
                            ))}
                        </div>
                        {children}
                    </TableContext.Provider>
                </div>
                {paginator && !tabletBreak && (
                    <Paginator
                        countPages={5}
                        currentPage={currentPage}
                        handlePaginatorClick={(page: number) =>
                            setCurrentPage(page)
                        }
                    />
                )}
            </div>
            {paginator && tabletBreak && (
                <Paginator
                    countPages={5}
                    currentPage={currentPage}
                    handlePaginatorClick={(page: number) =>
                        setCurrentPage(page)
                    }
                />
            )}
        </div>
    );
};
