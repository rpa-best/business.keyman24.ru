import { TableState } from 'react-table'
import Headers from '../config/tableHeaders'
import { useAppSelector } from '../hooks/useReduxHooks'
import IEntityByKey from '../models/IEntityByKey'
import { type ReducerServiceInterface } from '../services/ReducerService'
import {
    deviceReducer,
    imageNestedInventoryReducer,
    inventoryReducer,
    locationReducer,
    objectNestedLocationReducer,
    permissionGroupReducer,
    permissionLevelReducer,
    sessionNestedWorkingAreaReducer,
    workerReducer,
    workerCardReducer,
    workerDocsReducer,
    workingAreaReducer,
    inventoryUploadReducer,
} from '../store'
import elementNestedSessionSlice from '../store/slices/elementNestedSessionSlice'
import { PermissionEnum } from '../models/primitives'
import hasPermissionFromArray from './hasPermmisionFromArray'

export interface IEntityButtons {
    [key: string]: boolean | undefined
    read?: boolean
    add?: boolean
    dropdown?: boolean
    edit?: boolean
    delete?: boolean
    request?: boolean
    nested?: boolean
}

interface IEntity {
    reducer: ReducerServiceInterface
    callSelector: any
    columns: any
    title: string | null
    endpointOriginal?: string
    endpointNested?: string
    showButtons: IEntityButtons
    tableInitialState?: Partial<TableState<{}>>
}

const entity: IEntityByKey<IEntity> = {
    device: {
        reducer: deviceReducer,
        callSelector: () => useAppSelector(state => state.device),
        columns: Headers.deviceExport,
        title: 'Устройство',
        showButtons: {},
    },
    location: {
        reducer: locationReducer,
        callSelector: () => useAppSelector(state => state.location),
        columns: Headers.locationExport,
        title: 'Локация',
        endpointNested: 'object',
        showButtons: {
            add: true,
            edit: true,
            delete: true,
            nested: true,
        },
    },
    'object-nested-location': {
        reducer: objectNestedLocationReducer,
        callSelector: () => useAppSelector(state => state.objectNestedLocation),
        columns: Headers.objectNestedLocationExport,
        title: 'Вложенные объекты',
        endpointOriginal: 'location',
        endpointNested: 'object',
        showButtons: {
            add: true,
            edit: true,
            delete: true,
        },
    },
    worker: {
        reducer: workerReducer,
        callSelector: () => useAppSelector(state => state.worker),
        columns: Headers.workerExport,
        title: 'Работники',
        showButtons: { delete: true, edit: true },
    },
    'card-nested-worker': {
        reducer: workerCardReducer,
        callSelector: () => useAppSelector(state => state.workerCard),
        columns: Headers.workerCardExport,
        title: 'Выданные карты',
        endpointOriginal: 'worker',
        endpointNested: 'card',
        showButtons: {},
    },
    'docs-nested-worker': {
        reducer: workerDocsReducer,
        callSelector: () => useAppSelector(state => state.workerDocs),
        columns: Headers.workerDocsExport,
        title: 'Документы работников',
        endpointOriginal: 'worker',
        endpointNested: 'docs',
        showButtons: {},
    },
    'permission-group': {
        reducer: permissionGroupReducer,
        callSelector: () => useAppSelector(state => state.permissionGroup),
        columns: Headers.permissionGroupExport,
        title: 'Группа прав доступа',
        showButtons: { add: true, edit: true, delete: true },
    },
    // 'permission-level': {
    //     reducer: permissionLevelReducer,
    //     callSelector: () => useAppSelector(state => state.permissionLevel),
    //     columns: Headers.permissionLevelExport,
    //     title: 'Уровень прав доступа',
    //     showButtons: {},
    // },
    inventory: {
        reducer: inventoryReducer,
        callSelector: () => useAppSelector(state => state.inventory),
        columns: Headers.inventoryExport,
        title: 'Инвентарь',
        endpointNested: 'image',
        showButtons: { add: true, edit: true, delete: true },
    },
    'inventory-upload': {
        reducer: inventoryUploadReducer,
        callSelector: () => useAppSelector(state => state.inventoryUpload),
        columns: Headers.inventoryUploadExport,
        title: 'Файлы',
        showButtons: { delete: true },
    },
    'image-nested-inventory': {
        reducer: imageNestedInventoryReducer,
        callSelector: () => useAppSelector(state => state.imageNestedInventory),
        columns: Headers.imageNestedInventoryExport,
        title: 'Вложенные файлы',
        endpointOriginal: 'inventory',
        endpointNested: 'image',
        showButtons: {
            add: true,
            delete: true,
        },
    },
    'working-area': {
        reducer: workingAreaReducer,
        callSelector: () => useAppSelector(state => state.workingArea),
        columns: Headers.workingAreaExport,
        title: 'Рабочее место',
        // endpointNested: (id: number) => 'session',
        endpointNested: 'session',
        showButtons: { add: true, edit: true, delete: true, nested: true },
    },
    'session-nested-working-area': {
        reducer: sessionNestedWorkingAreaReducer,
        callSelector: () =>
            useAppSelector(state => state.sessionNestedWorkingArea),
        columns: Headers.workingAreaSessionExport,
        title: 'Вложенные сессии',
        endpointOriginal: 'working-area',
        endpointNested: 'session',
        showButtons: { add: true, delete: true },
        tableInitialState: { hiddenColumns: ['id', 'user.username'] },
    },
}

const getEntity = (data: string): IEntity => {
    return entity[data]
}

export default getEntity
