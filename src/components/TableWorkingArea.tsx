/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../assets/styles/scss/table.scss'
import getEntity from '../helpers/fixMe'
import {
    currentOffset,
    currentPageByOffset,
    pagesLength,
} from '../helpers/tablePaginationHelper'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { ReactComponent as SVGBrowse } from '../assets/img/table/browse.svg'
import { ReactComponent as SVGEdit } from '../assets/img/table/edit.svg'
import { ReactComponent as SVGDelete } from '../assets/img/table/delete.svg'
import { ReactComponent as SVGCheck } from '../assets/img/table/check.svg'
import { ReactComponent as SVGNested } from '../assets/img/table/nested.svg'
import IEntityByKey from '../models/IEntityByKey'
import getTableRowId from '../helpers/getTableRowId'
import TableRow from './Table/TableRow'
import TablePagination from './Table/TablePagination'
import TableHeaderGroups from './Table/TableHeaderGroups'
import Spinner from './Spinner/Spinner'
import validateButtons from '../helpers/validateButtons'

interface TableProps {
    endpoint?: string
}

const Temp: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const { endpoint = '' } = props
    const {
        reducer, callSelector, columns, title, showButtons: tempButtons,
    } = getEntity(endpoint)

    const showButtons = validateButtons(tempButtons, callSelector().permissions)

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
    } = useTable({
        columns: columns.default,
        data: JSON.parse(JSON.stringify(callSelector().list)),
    })

    const isLoading = callSelector().isLoading === 'list'

    const pagesCount = pagesLength(callSelector().count)
    const offsetValue = callSelector().offset
    const currentOrderBy = callSelector().orderBy
    const { currentOrg } = useAppSelector(state => state.org)

    useEffect(() => {
        const dispatchedThunk = dispatch(
            reducer.fetchWithParams({
                offset: offsetValue,
                orderBy: currentOrderBy,
                filter: 'deleted=false&limit=10',
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
    }

    // const sessionType: IEntityByKey<string> = {
    //     register: 'session/register',
    // }

    const getEndpointByType = (type: string) => {
        switch (type) {
        case 'register':
            return 'session/register/'
        case 'security':
            return 'session/security/'
        case 'inventory':
            return 'session/inventory/'
        case 'register_inventory':
            return 'session/register_inventory/'
        case 'key':
            return 'session/key/'
        default:
            return 'session/'
        }
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
                                    {rows.map((row, index) => {
                                        prepareRow(row)
                                        // <TableRow
                                        //     row={row}
                                        //     prepareRow={prepareRow}
                                        //     endpoint={endpoint}
                                        //     key={index}
                                        // />
                                        return (
                                            <tr
                                                {...row.getRowProps()}
                                                key={index}
                                            >
                                                {row.cells.map(cell => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                        >
                                                            {cell.render(
                                                                'Cell',
                                                            )}
                                                        </td>
                                                    )
                                                })}
                                                <td>
                                                    <div className='actions-wrapper'>
                                                        {showButtons.nested && (
                                                            <Link
                                                                to={`/${
                                                                    currentOrg.id
                                                                }/${endpoint}/${
                                                                    row
                                                                        .cells?.[0]
                                                                        .value
                                                                }/edit/${getEndpointByType(
                                                                    (
                                                                        row
                                                                            .cells?.[0] as any
                                                                    ).row
                                                                        .original
                                                                        .type
                                                                        .slug,
                                                                )}`}
                                                            >
                                                                <span>
                                                                    <SVGNested />
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {showButtons.request && (
                                                            <Link
                                                                to={`/${currentOrg.id}/${endpoint}/${row.cells?.[0].value}/edit`}
                                                            >
                                                                <span>
                                                                    <SVGCheck />
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {showButtons.edit && (
                                                            <Link
                                                                to={`/${currentOrg.id}/${endpoint}/${row.cells?.[0].value}/edit`}
                                                            >
                                                                <span>
                                                                    <SVGEdit />
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {showButtons.delete && (
                                                            <button
                                                                type='button'
                                                                onClick={() =>
                                                                    dispatch(
                                                                        reducer.delete(
                                                                            row
                                                                                .cells?.[0]
                                                                                .value,
                                                                        ),
                                                                    )}
                                                            >
                                                                <span>
                                                                    <SVGDelete fill='#A1A1A1' />
                                                                </span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
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

const TableWorkingArea: FC<TableProps> = props => {
    const loaderData: any = useLoaderData()

    const { endpoint } = loaderData
    return <Temp endpoint={endpoint} />
}

export default TableWorkingArea
