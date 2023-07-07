import { Row } from 'react-table'

const getTableRowId = (row: Row, key: string) => {
    return (row.cells?.[0] as any).row.original[key]
}

export default getTableRowId
