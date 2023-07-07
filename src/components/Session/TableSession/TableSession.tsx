/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React, { FC, useEffect } from 'react'
import {
    Link, useLoaderData, useLocation, useNavigate,
} from 'react-router-dom'
import { useTable } from 'react-table'
import '../../../assets/styles/scss/table.scss'
import {
    currentOffset,
    currentPageByOffset,
    pagesLength,
} from '../../../helpers/tablePaginationHelper'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks'
import { ReactComponent as SVGBrowse } from '../../../assets/img/table/browse.svg'
import { ReactComponent as SVGEdit } from '../../../assets/img/table/edit.svg'
import { ReactComponent as SVGDelete } from '../../../assets/img/table/delete.svg'
import { ReactComponent as SVGCheck } from '../../../assets/img/table/check.svg'
import { ReactComponent as SVGPlay } from '../../../assets/img/table/play.svg'
import getEntity from '../../../helpers/fixMe'
import { sessionNestedWorkingAreaReducer } from '../../../store'
import TablePagination from '../../Table/TablePagination'
import Spinner from '../../Spinner/Spinner'
import getTableRowId from '../../../helpers/getTableRowId'
import validateButtons from '../../../helpers/validateButtons'

interface TableProps {
    endpoint?: string
    id?: number
}

const TableSession: FC<TableProps> = props => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const loaderData: any = useLoaderData()
    // eslint-disable-next-line react/destructuring-assignment
    const id = props.id || loaderData.id
    // eslint-disable-next-line react/destructuring-assignment
    const endpoint = props.endpoint || loaderData.endpoint
    const {
        reducer,
        callSelector,
        columns,
        endpointOriginal,
        endpointNested,
        showButtons: tempButtons,
        title,
    } = getEntity(endpoint)

    const showButtons = validateButtons(tempButtons, callSelector().permissions)

    const {
        getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,
    } = useTable({
        columns: columns.default,
        data: JSON.parse(JSON.stringify(callSelector().list)),
    })
    // dispatch(reducer.changeOrdering('status'))

    const { currentOrg } = useAppSelector(state => state.org)

    const pagesCount = pagesLength(callSelector().count)
    const offsetValue = callSelector().offset
    const currentOrderBy = callSelector().orderBy

    useEffect(() => {
        const dispatchedThunk = id !== 0
            && dispatch(
                reducer.fetchWithParamsNested({
                    offset: offsetValue,
                    orderBy: currentOrderBy,
                    id,
                    endpoint: String(endpointNested),
                }),
            )

        return () => {
            // eslint-disable-next-line no-unused-expressions
            id !== 0 && dispatchedThunk && dispatchedThunk.abort()
        }
    }, [offsetValue, currentOrderBy, endpoint, id])

    const handleOrderBy = (field: string) => {
        dispatch(
            reducer.changeOrdering(
                currentOrderBy === field ? `-${field}` : field,
            ),
        )
    }

    if (callSelector().isLoading === 'list') {
        return <Spinner />
    }

    const handlePaginationClick = (page: number) => {
        dispatch(reducer.changeOffset(currentOffset(page)))
    }

    const handleMainClick = () => {
        dispatch(
            sessionNestedWorkingAreaReducer.createNested({} as any, {
                id,
                endpoint: String(endpointNested),
            }),
        ).then(() =>
            dispatch(
                reducer.fetchWithParamsNested({
                    offset: offsetValue,
                    orderBy: currentOrderBy,
                    id,
                    endpoint: String(endpointNested),
                }),
            ))
        // dispatch(
        //     reducer.fetchWithParamsNested({
        //         offset: offsetValue,
        //         orderBy: currentOrderBy,
        //         id,
        //         endpoint: String(endpointNested),
        //     }),
        // )
    }

    return (
        <>
            <h1 className='section-header'>{`${title} / Список`}</h1>
            <div className='table-wrapper'>
                <div className='table-content'>
                    <table className='table' {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr
                                    {...headerGroup.getHeaderGroupProps()}
                                    key={headerGroup.getHeaderGroupProps().key}
                                >
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    handleOrderBy(column.id)
                                                }}
                                            >
                                                {column.render('Header')}
                                            </button>
                                        </th>
                                    ))}
                                    <th>
                                        <button
                                            type='button'
                                            className='table-main-action'
                                            onClick={handleMainClick}
                                        >
                                            Добавить
                                        </button>
                                    </th>
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row)
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        key={row.getRowProps().key}
                                    >
                                        {row.cells.map(cell => {
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    key={
                                                        cell.getCellProps().key
                                                    }
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        })}

                                        <td>
                                            <div className='actions-wrapper'>
                                                <Link
                                                    to={`/${currentOrg.id}/${endpointOriginal}/${id}/edit/${endpointNested}/${getTableRowId(row, 'id')}/edit`}
                                                >
                                                    <span>
                                                        <SVGPlay stroke='#A1A1A1' />
                                                    </span>
                                                </Link>
                                                {showButtons.delete && (
                                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                                    <a
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            dispatch(
                                                                reducer.deleteNested(
                                                                    Number(getTableRowId(row, 'id')),
                                                                    {
                                                                        id,
                                                                        endpoint:
                                                                            String(
                                                                                endpointNested,
                                                                            ),
                                                                    },
                                                                ),
                                                            ).then(() =>
                                                                dispatch(
                                                                    reducer.fetchWithParamsNested(
                                                                        {
                                                                            offset: offsetValue,
                                                                            orderBy:
                                                                                currentOrderBy,
                                                                            id,
                                                                            endpoint:
                                                                                String(
                                                                                    endpointNested,
                                                                                ),
                                                                        },
                                                                    ),
                                                                ))
                                                        }}
                                                    >
                                                        <span>
                                                            <SVGDelete fill='#A1A1A1' />
                                                        </span>
                                                    </a>
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
            </div>
        </>
    )
}

export default TableSession
