import React, { FC } from 'react'

interface TablePaginationProps {
    pagesCount: number
    currentPage: number
    handleClick: (page: number) => void
}

const TablePagination: FC<TablePaginationProps> = ({
    pagesCount,
    currentPage,
    handleClick,
}) => {
    return (
        <div className='pagination-wrapper'>
            <div className='page-switch'>
                {Array.from(
                    { length: pagesCount >= 1 ? pagesCount : 1 },
                    (_, index) => index + 1,
                ).map((page, index) => (
                    <button
                        type='button'
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={
                            page === currentPage
                                ? 'active-action'
                                : 'table-page-link'
                        }
                        onClick={() => handleClick(page)}
                    >
                        <span>{page}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TablePagination
