/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect, useState, useMemo } from 'react'
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
import { ReactComponent as SVGDropdownArrow } from '../assets/img/shared/arrows/arrow-left.svg'
import validateButtons from '../helpers/validateButtons'
import Spinner from './Spinner/Spinner'
import TablePagination from './Table/TablePagination'
import TableRow from './Table/TableRow'
import ModalFiles from './Modals/ModalFiles'

interface TableInventoryProps {
    endpoint?: string
}

const DropdownFiles: FC = () => {
    const [show, setShow] = useState(false)

    return (
        <div className='files-wrapper'>
            <div className='dropdown-files dropstart'>
                <div
                    className='btn btn-files'
                    role='button'
                    onClick={() => setShow(true)}
                >
                    <div className='dropdown-arr tools-icon'>
                        <SVGDropdownArrow
                            style={{
                                height: '15px',
                                width: '15px',
                            }}
                            stroke='white'
                        />
                    </div>
                    <span>Файлы</span>
                </div>
            </div>
            {show && <ModalFiles handleClose={() => setShow(false)} />}
        </div>
    )
}

const Temp: FC<TableInventoryProps> = props => {
    const dispatch = useAppDispatch()
    const { endpoint = '' } = props
    const {
        reducer,
        callSelector,
        columns,
        title,
        showButtons: tempButtons,
        endpointNested,
    } = getEntity(endpoint)

    const showButtons = validateButtons(tempButtons, callSelector().permissions)

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns: columns.default,
            data: JSON.parse(JSON.stringify(callSelector().list)),
        })

    const isLoading = callSelector().isLoading === 'list'
    const { currentOrg } = useAppSelector(state => state.org)

    const pagesCount = pagesLength(callSelector().count)
    const offsetValue = callSelector().offset
    const currentOrderBy = callSelector().orderBy

    useEffect(() => {
        const dispatchedThunk = dispatch(
            reducer.fetchWithParams({
                offset: offsetValue,
                orderBy: currentOrderBy,
                filter: 'limit=10',
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

    return (
        <>
            <h1 className='section-header'>{`${title} / Список`}</h1>
            <div className='table-wrapper'>
                {!isLoading ? (
                    <>
                        <div className='table-content'>
                            <table className='table' {...getTableProps()}>
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr
                                            {...headerGroup.getHeaderGroupProps()}
                                        >
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                >
                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            handleOrderBy(
                                                                column.id,
                                                            )
                                                        }
                                                    >
                                                        {column.render(
                                                            'Header',
                                                        )}
                                                    </button>
                                                </th>
                                            ))}
                                            {showButtons.dropdown &&
                                                showButtons.add && (
                                                    <th className='inventory-actions'>
                                                        <DropdownFiles />
                                                        <Link
                                                            to={`/${currentOrg.id}/${endpoint}/create`}
                                                        >
                                                            <div className='search-line'>
                                                                Добавить
                                                            </div>
                                                        </Link>
                                                    </th>
                                                )}
                                            {showButtons.add &&
                                                !showButtons.dropdown && (
                                                    <th>
                                                        <Link
                                                            to={`/${currentOrg.id}/${endpoint}/create`}
                                                        >
                                                            <div className='search-line'>
                                                                Добавить
                                                            </div>
                                                        </Link>
                                                    </th>
                                                )}
                                        </tr>
                                    ))}
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

const TableInventory: FC<TableInventoryProps> = props => {
    const loaderData: any = useLoaderData()

    const { endpoint } = loaderData
    return <Temp endpoint={endpoint} />
}

export default TableInventory
