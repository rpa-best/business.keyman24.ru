/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../../../assets/styles/scss/table.scss'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks'
import {
    sessionElementExport,
    sessionRegisterElementExport,
} from '../../../config/tableHeaders'
import Spinner from '../../Spinner/Spinner'
import {
    currentOffset,
    currentPageByOffset,
    pagesLength,
} from '../../../helpers/tablePaginationHelper'
import {
    changeOffsetElement,
    changeOrderingElement,
    fetchElementWithParams,
} from '../../../store/slices/elementNestedSessionSlice'
import TablePagination from '../../Table/TablePagination'
import TableRow from '../../Table/TableRow'
import TableHeaderGroups from '../../Table/TableHeaderGroups'
import getHeadersByType from '../../../helpers/getHeadersByType'

interface TableProps {
    endpoint?: string
    sessionId?: number
    areaId?: number
    orgId?: number
    workerId?: number
    sessionType: string
    refetch: boolean
    // callback: () => void
}

const Temp: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const {
        endpoint = '',
        sessionId = 0,
        areaId = 0,
        orgId = 0,
        workerId = 0,
        sessionType,
        refetch,
        // callback,
    } = props

    const {
        list: fetchedElements,
        count,
        offset: offsetValue,
        orderBy: currentOrderBy,
    } = useAppSelector(state => state.elementNestedSession)
    const isLoading = useAppSelector(state => state.elementNestedSession.isLoading) === 'list'

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
    } = useTable({
        columns: getHeadersByType(sessionType),
        data: fetchedElements,
    })

    const pagesCount = pagesLength(count)

    const doRefetch = () => {
        return dispatch(
            fetchElementWithParams({
                data: {
                    orgId,
                    areaId,
                    sessionId,
                },
                params: {
                    offset: offsetValue,
                    orderBy: currentOrderBy,
                    filter: 'limit=10',
                },
            }),
        )
    }

    useEffect(() => {
        const dispatchedThunk = dispatch(
            fetchElementWithParams({
                data: {
                    orgId,
                    areaId,
                    sessionId,
                },
                params: {
                    offset: offsetValue,
                    orderBy: currentOrderBy,
                    filter: 'limit=10',
                },
            }),
        )

        return () => {
            dispatchedThunk.abort()
        }
    }, [offsetValue, currentOrderBy, endpoint, refetch])

    const handleOrderBy = (field: string) => {
        dispatch(
            changeOrderingElement(
                currentOrderBy === field ? `-${field}` : field,
            ),
        )
    }

    const handlePaginationClick = (page: number) => {
        dispatch(changeOffsetElement(currentOffset(page)))
    }

    const title = 'Element'

    return (
        <>
            <h1 className='section-header'>{`${title} / Список`}</h1>
            <div className='table-wrapper' style={{paddingRight: '30px'}}>
                {!isLoading ? (
                    <>
                        <div className='table-content'>
                            <table className='table' {...getTableProps()}>
                                <thead>
                                    <TableHeaderGroups
                                        headerGroups={headerGroups as any}
                                        showAdd={null}
                                        handleHeaderClick={handleOrderBy}
                                    />
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row, index) => {
                                        prepareRow(row)
                                        return (
                                            <tr
                                                {...row.getRowProps()}
                                                key={row.getRowProps().key}
                                            >
                                                {row.cells.map(cell => (
                                                    <td
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <TablePagination
                            pagesCount={pagesCount}
                            currentPage={currentPageByOffset(offsetValue)}
                            handleClick={handlePaginationClick}
                        />
                    </>
                ) : (
                    <div className='table-body-spinner'>
                        <Spinner />
                    </div>
                )}
            </div>
        </>
    )
}

const TableSessionElement: FC<TableProps> = props => {
    const loaderData: any = useLoaderData()
    // const { sessionType, callback } = props
    const { sessionType, refetch} = props

    const {
        extraId: sessionId, orgId, areaId, workerId,
    } = loaderData
    return (
        <Temp
            sessionId={sessionId}
            orgId={orgId}
            areaId={areaId}
            workerId={workerId}
            sessionType={sessionType}
            refetch={refetch}
            // callback={callback}
        />
    )
}

export default TableSessionElement
