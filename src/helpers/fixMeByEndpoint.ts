import Headers from '../config/tableHeaders'
import { useAppSelector } from '../hooks/useReduxHooks'
import IEntityByKey from '../models/IEntityByKey'
import {
    deviceReducer,
    locationReducer,
    objectNestedLocationReducer,
    permissionGroupReducer,
    permissionLevelReducer,
    workerReducer,
} from '../store'

interface IEntity {
    reducer: any
    callSelector: any
    columns: any
    title: string | null
    showButtons: {
        read?: boolean
        add?: boolean
        edit?: boolean
        delete?: boolean
        request?: boolean
    }
    endpoint: string[]
    id: number[]
}

const entity: IEntityByKey<Omit<IEntity, 'id'>> = {
    'location-object': {
        reducer: objectNestedLocationReducer,
        callSelector: () => useAppSelector(state => state.objectNestedLocation),
        columns: Headers.locationExport,
        title: 'Объекты локации',
        showButtons: { add: true, edit: true, delete: true },
        endpoint: 'location-object'.split('-'),
    },
}

const getEntityByEndpoint = (data: string, id: number[]): IEntity => {
    return { ...entity[data], id }
}

export default getEntityByEndpoint
