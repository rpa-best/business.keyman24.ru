import React, { ReactElement } from 'react';

export interface TableRows extends Record<string, any> {
    id: number;
}

export interface ITableContext {
    setHeaders: React.Dispatch<React.SetStateAction<IHeader[]>>;
}

export interface IHeader {
    name: string;
    field: string;
    sortable: boolean;
}

export interface ColumnHeaderProps extends IHeader {
    sortTableData: (field: string) => void;
    sortedField: string;
    field: string;
    headersCount: number;
    lastChild: boolean;
    buttonData?: { onClick: () => void; text: string };
    stopPropagation?: boolean;
}

interface PaginatorData {
    offset: number;
    countItems: number;
}

export interface TableProps {
    tableData: TableRows[];
    setTableData: React.Dispatch<React.SetStateAction<any[]>>;
    children: ReactElement<ColumnProps> | Array<ReactElement<ColumnProps>>;
    height?: 'max-content';
    buttonData?: { onClick: () => void; text: string };
    handleRowClick?: (id: number) => void;
    handleEditClick?: (id: number) => void;
    handleDeleteClick?: (id: number) => Promise<void>;
    paginatorData?: PaginatorData;
    rowClickable?: boolean;
    prefetch?: (id: number) => void;
    errorRowIds?: number[];
    stopPropagation?: boolean;
}

export interface ColumnProps {
    header: string;
    field: string;
    sortable?: boolean;
}

export interface PaginatorProps {
    countPages: number;
    currentPage: number;
    handlePaginatorClick: (page: number) => void;
    offset: number;
}

export interface ColumnRowProps {
    headers: IHeader[];
    item: TableRows;
    setTableData: React.Dispatch<React.SetStateAction<TableRows[]>>;
    handleEditClick?: (id: number) => void;
    handleDeleteClick?: (id: number) => Promise<void>;
    stopPropagation?: boolean;
}
