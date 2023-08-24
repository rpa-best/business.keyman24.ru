import React from 'react';

import { PaginatorProps } from 'components/Table/types';

import scss from '../Table.module.scss';

export const Paginator: React.FC<PaginatorProps> = ({
    handlePaginatorClick,
    currentPage,
    countPages,
}) => {
    return (
        <div className={scss.paginator_container}>
            {Array.from({ length: countPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                    <span
                        key={pageNumber}
                        className={
                            currentPage === pageNumber
                                ? scss.paginator_item_active
                                : scss.paginator_item
                        }
                        onClick={() => handlePaginatorClick(pageNumber)}
                    >
                        {pageNumber}
                    </span>
                )
            )}
        </div>
    );
};
