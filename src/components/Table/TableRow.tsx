import React, { FC, Key } from 'react'
import { Link } from 'react-router-dom'
import { type Row } from 'react-table'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { ReactComponent as SVGBrowse } from '../../assets/img/table/browse.svg'
import { ReactComponent as SVGEdit } from '../../assets/img/table/edit.svg'
import { ReactComponent as SVGDelete } from '../../assets/img/table/delete.svg'
import { ReactComponent as SVGCheck } from '../../assets/img/table/check.svg'
import { ReactComponent as SVGNested } from '../../assets/img/table/nested.svg'
import getEntity, { IEntityButtons } from '../../helpers/fixMe'
import validateButtons from '../../helpers/validateButtons'
import { ReducerServiceInterface } from '../../services/ReducerService'

interface TableRowProps {
    row: Row<object>
    prepareRow: (row: Row<object>) => void
    endpoint: string
    reducer: ReducerServiceInterface
    showButtons: IEntityButtons
    // eslint-disable-next-line react/require-default-props
    endpointNested?: string
}

const TableRow: FC<TableRowProps> = (props) => {
    const dispatch = useAppDispatch()
    const { row, prepareRow, endpoint, endpointNested = '', showButtons, reducer} = props
    const { currentOrg } = useAppSelector(state => state.org)
    // const { reducer, showButtons: tempButtons, endpointNested, callSelector } = getEntity(endpoint)
    // const showButtons = validateButtons(tempButtons, callSelector().permissions)

    prepareRow(row)

    return (
        <tr {...row.getRowProps()}>
            {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            ))}
            <td>
                <div className='actions-wrapper'>
                    {showButtons.nested && (
                        <Link
                            to={`/${currentOrg.id}/${endpoint}/${row.cells?.[0].value}/edit/${endpointNested}/`}
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
                                dispatch(reducer.delete(row.cells?.[0].value))
                            }
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
}

export default TableRow
