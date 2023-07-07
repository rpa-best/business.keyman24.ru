/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../../assets/styles/scss/table.scss'
import getEntity from '../../helpers/fixMe'
import {
    currentOffset,
    currentPageByOffset,
    pagesLength,
} from '../../helpers/tablePaginationHelper'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Spinner from '../Spinner/Spinner'
import TableHeaderGroups from './TableHeaderGroups'
import TablePagination from './TablePagination'
import TableRow from './TableRow'
import validateButtons from '../../helpers/validateButtons'

interface TableProps {
    endpoint?: string
}

const Temp: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const { endpoint = '' } = props
    const {
        reducer,
        callSelector,
        columns,
        title,
        showButtons: tempButtons,
        tableInitialState,
        endpointNested,
    } = getEntity(endpoint)

    const showButtons = validateButtons(tempButtons, callSelector().permissions)

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns: columns.default,
            data: JSON.parse(JSON.stringify(callSelector().list)),
            initialState: tableInitialState,
        })

    const isLoading = callSelector().isLoading === 'list'

    const pagesCount = pagesLength(callSelector().count)
    const offsetValue = callSelector().offset
    const currentOrderBy = callSelector().orderBy
    // const { id } = useAppSelector(state => state.org.currentOrg)

    useEffect(() => {
        const dispatchedThunk = dispatch(
            reducer.fetchWithParams({
                offset: offsetValue,
                orderBy: currentOrderBy,
                filter:
                    endpoint === 'location'
                        ? 'limit=10&deleted=false'
                        : 'limit=10',
            }),
        )

        return () => {
            dispatchedThunk.abort()
        }
    }, [offsetValue, currentOrderBy, endpoint])

    const handleOrderBy = (field: string) => {
        dispatch(
            reducer.changeOrdering(
                currentOrderBy === field ? `-${field}` : field,
            ),
        )
    }

    const handlePaginationClick = (page: number) => {
        dispatch(reducer.changeOffset(currentOffset(page)))
        // navigate(location)
    }

    return (
        <>
            <h1 className='section-header'>{`${title} / Список`}</h1>
            <div className='table-wrapper'>
                {!isLoading ? (
                    <>
                        <div className='table-content'>
                            <table className='table' {...getTableProps()}>
                                <thead>
                                    <TableHeaderGroups
                                        headerGroups={headerGroups}
                                        showAdd={
                                            showButtons.add ? endpoint : null
                                        }
                                        handleHeaderClick={handleOrderBy}
                                    />
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row, index) => (
                                        <TableRow
                                            row={row}
                                            prepareRow={prepareRow}
                                            endpoint={endpoint}
                                            endpointNested={endpointNested}
                                            reducer={reducer}
                                            showButtons={showButtons}
                                            key={index}
                                        />
                                    ))}
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

const Table: FC<TableProps> = props => {
    const loaderData: any = useLoaderData()

    const { endpoint } = loaderData
    return <Temp endpoint={endpoint} />
}

export default Table
