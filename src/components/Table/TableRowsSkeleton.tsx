/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
import Skeleton from 'react-loading-skeleton'
import React, { FC } from 'react'

interface TableRowsSkeletonProps {
    columnsCount?: number
    rowsCount?: number
}

const TableRowsSkeleton: FC<TableRowsSkeletonProps> = ({ columnsCount = 3, rowsCount = 10 }) => {
    return (
        <>
            {Array.from({ length: rowsCount }).map((_, index) => (
                <tr key={index}>
                    {Array.from({ length: columnsCount }).map((__, iter) => (
                        <td key={iter}>
                            <Skeleton />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}

export default TableRowsSkeleton
