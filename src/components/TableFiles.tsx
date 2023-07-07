/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../assets/styles/scss/table.scss'
import { useDropzone } from 'react-dropzone'
import getEntity from '../helpers/fixMe'
import {
    currentOffset,
    currentPageByOffset,
    pagesLength,
} from '../helpers/tablePaginationHelper'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { ReactComponent as SVGDownload } from '../assets/img/shared/download.svg'
import { ReactComponent as SVGDelete } from '../assets/img/table/delete.svg'
import getTableRowId from '../helpers/getTableRowId'
import $api from '../http'
import { PermissionEnum } from '../models/primitives'
import hasPermissionFromArray from '../helpers/hasPermmisionFromArray'
import validateButtons from '../helpers/validateButtons'
import Spinner from './Spinner/Spinner'
import TablePagination from './Table/TablePagination'

interface TableProps {
    inventoryType: string
}

const TableFiles: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const { inventoryType } = props
    const endpoint = 'inventory-upload'
    const {
        reducer,
        callSelector,
        columns,
        title,
        showButtons: tempButtons,
        endpointNested,
        tableInitialState,
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

    const refetch = () => {
        return dispatch(
            reducer.fetchWithParams({
                offset: offsetValue,
                orderBy: currentOrderBy,
                filter: `type=${inventoryType}&limit=10`,
            }),
        )
    }

    useEffect(() => {
        // if (endpoint === 'location') {
        //     dispatch(
        //         reducer.fetchWithParams({
        //             offset: offsetValue,
        //             orderBy: currentOrderBy,
        //             filter: 'deleted=false',
        //         }),
        //     )
        // } else {
        // dispatch(
        //     reducer.fetchWithParams({
        //         offset: offsetValue,
        //         orderBy: currentOrderBy,
        //     }),
        // )
        // }

        const dispatchedThunk = refetch()

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

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        multiple: false,
        async onDrop(files, fileRejections, event) {
            const data = new FormData()
            data.append('image', files[0])

            const result = await $api.post(
                `business/${Number(
                    localStorage.getItem('currOrg'),
                )}/inventory/upload/`,
                {
                    file: files[0],
                    type: inventoryType,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // 'Content-Type':
                        //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                },
            )

            // dispatch(
            //     reducer.create({
            //         file: files[0],
            //         type: 'inventory',
            //     }),
            // )

            refetch()
        },
    })

    // console.log(import.meta.env.BASE_URL)

    const handleDownload = () => {
        const url = `${import.meta.env.BASE_URL}media/template.xlsx`
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'template.xlsx'
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
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
                                            key={
                                                headerGroup.getHeaderGroupProps()
                                                    .key
                                            }
                                        >
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                >
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            handleOrderBy(
                                                                column.id,
                                                            )
                                                        }}
                                                    >
                                                        {column.render(
                                                            'Header',
                                                        )}
                                                    </button>
                                                </th>
                                            ))}
                                            {/* <th>
                                                <div
                                                    {...getRootProps({
                                                        className: 'dropzone',
                                                    })}
                                                >
                                                    <div className='content-wrapper'>
                                                        <input
                                                            className='input-zone'
                                                            {...getInputProps()}
                                                        />
                                                        <div className='text-center'>
                                                            <p className='dropzone-content'>
                                                                Добавить файл
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </th> */}
                                            <th className='inventory-actions'>
                                                <div className='files-wrapper'>
                                                    <div className='dropdown-files dropstart'>
                                                        <button
                                                            className='btn btn-files'
                                                            type='button'
                                                            onClick={handleDownload}
                                                        >
                                                            <div
                                                                className='dropdown-arr tools-icon'
                                                                style={{
                                                                    paddingRight:
                                                                        '5px',
                                                                }}
                                                            >
                                                                <SVGDownload
                                                                    style={{
                                                                        height: '20px',
                                                                        width: '20px',
                                                                    }}
                                                                    stroke='white'
                                                                />
                                                            </div>
                                                            <span>Шаблон</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div
                                                    {...getRootProps({
                                                        className: 'dropzone',
                                                    })}
                                                >
                                                    <div className='content-wrapper'>
                                                        <input
                                                            className='input-zone'
                                                            {...getInputProps()}
                                                        />
                                                        <div className='text-center'>
                                                            <p className='dropzone-content'>
                                                                Добавить файл
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                                cell.getCellProps()
                                                                    .key
                                                            }
                                                        >
                                                            {cell.render(
                                                                'Cell',
                                                            )}
                                                        </td>
                                                    )
                                                })}

                                                <td>
                                                    <div className='actions-wrapper'>
                                                        {getTableRowId(
                                                            row,
                                                            'pdf',
                                                        ) && (
                                                            <>
                                                                <Link
                                                                    to={String(
                                                                        getTableRowId(
                                                                            row,
                                                                            'pdf',
                                                                        ),
                                                                    )}
                                                                >
                                                                    {/* <div
                                                                        className='display-flex justify-content-between'
                                                                        style={{
                                                                            width: '100%',
                                                                            background:
                                                                                '#A1A1A1',
                                                                            padding:
                                                                                '5px',
                                                                            borderRadius:
                                                                                '5px',
                                                                            color: 'white',
                                                                        }}
                                                                    >
                                                                        pdf{' '}
                                                                        <SVGDownload
                                                                            style={{
                                                                                height: '20px',
                                                                                width: '20px',
                                                                            }}
                                                                            stroke='white'
                                                                        />
                                                                    </div> */}
                                                                    <SVGDownload
                                                                        style={{
                                                                            height: '20px',
                                                                            width: '20px',
                                                                        }}
                                                                        stroke='#A1A1A1'
                                                                    />
                                                                </Link>
                                                                <button
                                                                    type='button'
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            reducer.delete(
                                                                                Number(
                                                                                    getTableRowId(
                                                                                        row,
                                                                                        'id',
                                                                                    ),
                                                                                ),
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    <span>
                                                                        <SVGDelete fill='#A1A1A1' />
                                                                    </span>
                                                                </button>
                                                            </>
                                                        )}
                                                        {showButtons.delete &&
                                                            !getTableRowId(
                                                                row,
                                                                'pdf',
                                                            ) && (
                                                                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                                                <>
                                                                    <button type='button'>
                                                                        <span>
                                                                            <SVGDelete fill='var(--background-color-2)' />
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        type='button'
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                reducer.delete(
                                                                                    Number(
                                                                                        getTableRowId(
                                                                                            row,
                                                                                            'id',
                                                                                        ),
                                                                                    ),
                                                                                ),
                                                                            )
                                                                        }
                                                                    >
                                                                        <span>
                                                                            <SVGDelete fill='#A1A1A1' />
                                                                        </span>
                                                                    </button>
                                                                </>
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

export default TableFiles
