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
    tableRows: TableRows[];
    children: ReactElement<ColumnProps> | Array<ReactElement<ColumnProps>>;
    buttonData?: { onClick: () => void; text: string };
    handleRowClick?: (id: number) => void;
    handleEditClick?: (id: number) => void;
    handleDeleteClick?: (id: number) => void;
    paginatorData?: PaginatorData;
    rowClickable?: boolean;
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
}

export interface ColumnRowProps {
    headers: IHeader[];
    item: TableRows;
    handleEditClick?: (id: number) => void;
    handleDeleteClick?: (id: number) => void;
    stopPropagation?: boolean;
}
