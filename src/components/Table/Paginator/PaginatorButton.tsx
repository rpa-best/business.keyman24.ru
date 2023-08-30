import React from 'react';
import scss from 'components/Table/Table.module.scss';

interface PaginatorButtonProps {
    children?: number;
    currentPage: number;
    pageNumber: number;
    dots?: boolean;
    handlePaginatorClick: (page: number) => void;
}

export const PaginatorButton: React.FC<PaginatorButtonProps> = ({
    handlePaginatorClick,
    pageNumber,
    currentPage,
    children,
    dots = false,
}) => {
    if (dots) {
        return <span className={scss.paginator_item_dots}>. . .</span>;
    }
    return (
        <span
            className={
                currentPage === pageNumber
                    ? scss.paginator_item_active
                    : scss.paginator_item
            }
            onClick={() => handlePaginatorClick(pageNumber)}
        >
            {children}
        </span>
    );
};
