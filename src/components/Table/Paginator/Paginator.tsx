import React from 'react';

import { PaginatorProps } from 'components/Table/types';

import scss from '../Table.module.scss';
import { PaginatorButton } from 'components/Table/Paginator/PaginatorButton';

export const Paginator: React.FC<PaginatorProps> = ({
    handlePaginatorClick,
    currentPage,
    countPages,
    offset,
}) => {
    const artificialPagesArr = Array.from(
        { length: countPages },
        (_, index) => index + 1
    );

    if (countPages === 1) {
        return null;
    }

    return (
        <div className={scss.paginator_container}>
            {artificialPagesArr.map((pageNumber, index) => {
                if (countPages <= 5) {
                    return (
                        <PaginatorButton
                            offset={offset}
                            key={index}
                            currentPage={currentPage}
                            pageNumber={pageNumber}
                            handlePaginatorClick={handlePaginatorClick}
                        >
                            {pageNumber}
                        </PaginatorButton>
                    );
                } else if (index === 0 || index === countPages - 1) {
                    return (
                        <PaginatorButton
                            offset={offset}
                            key={index}
                            currentPage={currentPage}
                            pageNumber={pageNumber}
                            handlePaginatorClick={handlePaginatorClick}
                        >
                            {pageNumber}
                        </PaginatorButton>
                    );
                } else if (
                    index >= currentPage - 2 &&
                    index < currentPage + 1
                ) {
                    return (
                        <React.Fragment key={index}>
                            {currentPage > 3 && index === currentPage - 2 && (
                                <PaginatorButton
                                    offset={offset}
                                    currentPage={currentPage}
                                    pageNumber={pageNumber}
                                    handlePaginatorClick={handlePaginatorClick}
                                    dots
                                />
                            )}
                            <PaginatorButton
                                offset={offset}
                                key={index}
                                currentPage={currentPage}
                                pageNumber={pageNumber}
                                handlePaginatorClick={handlePaginatorClick}
                            >
                                {pageNumber}
                            </PaginatorButton>
                            {index + 1 === currentPage + 1 && (
                                <PaginatorButton
                                    offset={offset}
                                    currentPage={currentPage}
                                    pageNumber={pageNumber}
                                    handlePaginatorClick={handlePaginatorClick}
                                    dots
                                />
                            )}
                        </React.Fragment>
                    );
                }
            })}
        </div>
    );
};
