import convertDate from '../helpers/convertDate'
import { type IDeviceNested } from '../models/device'
import { type IInventory } from '../models/inventory'
import { type IPermissionGroup } from '../models/permission'
import { type IRegion } from '../models/region'
import { ISessionElement } from '../models/sessionElement'
import { type IWorker } from '../models/worker'
import { IWorkerDocs } from '../models/workerDocs'
import { type IWorkingArea } from '../models/workingArea'
import { type IWorkingAreaSession } from '../models/workingAreaSession'

export const device = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'тип',
        accessor: 'type',
    },
    {
        Header: 'описание',
        accessor: 'desc',
    },
]

export const deviceExport = {
    default: device,
    full: device,
}

export const location = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'описание',
        accessor: 'desc',
    },
]

export const locationExport = {
    default: location,
    full: location,
}

export const objectNestedLocation = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'описание',
        accessor: 'desc',
    },
]

export const objectNestedLocationExport = {
    default: objectNestedLocation,
    full: objectNestedLocation,
}

export const deviceType = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'slug',
        accessor: 'slug',
    },
]

export const deviceTypeExport = {
    default: deviceType,
    full: deviceType,
}

export const inventory = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'имя типа',
        id: 'type.name', //!
        accessor: (d: IInventory) => d.type?.name,
    },
    {
        Header: 'номер',
        accessor: 'number',
    },
]

export const inventoryFull = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'type_name',
        accessor: (d: IInventory) => d.type?.name,
    },
    {
        Header: 'описание',
        accessor: 'desc',
    },
    {
        Header: 'комментарии',
        accessor: 'comments',
    },
]

export const inventoryExport = {
    default: inventory,
    full: inventoryFull,
}

export const inventoryUpload = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
]

export const inventoryUploadExport = {
    default: inventoryUpload,
    full: inventoryUpload,
}

export const imageNestedInventory = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'дата добавления',
        accessor: 'date',
    },
]

export const imageNestedInventoryExport = {
    default: imageNestedInventory,
    full: imageNestedInventory,
}

export const organization = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'дата создания',
        accessor: 'create_at',
    },
]

export const organizationFull = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'дата создания',
        accessor: 'create_at',
    },
    {
        Header: 'lc_id',
        accessor: 'lc_id',
    },
    {
        Header: 'ИНН',
        accessor: 'inn',
    },
    {
        Header: 'адрес',
        accessor: 'address',
    },
    {
        Header: 'телефон',
        accessor: 'phone',
    },
    {
        Header: 'email',
        accessor: 'email',
    },
    {
        Header: 'регион',
        accessor: 'region',
    },
]

export const organizationExport = {
    default: organization,
    full: organizationFull,
}

export const permission = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'slug',
        accessor: 'slug',
    },
    {
        Header: 'уровень',
        accessor: 'level',
    },
]

export const permissionExport = {
    default: permission,
    full: permission,
}

export const permissionGroup = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'уровень',
        id: 'level.name', //!
        accessor: (d: IPermissionGroup) => d.level.name,
    },
]

export const permissionGroupExport = {
    default: permissionGroup,
    full: permissionGroup,
}

export const permissionLevel = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
]

export const permissionLevelExport = {
    default: permissionLevel,
    full: permissionLevel,
}

// export const region = [
//     {
//         Header: 'id',
//         accessor: 'id',
//     },
//     {
//         Header: 'имя',
//         accessor: 'name',
//     },
//     {
//         Header: 'статус',
//         accessor: (d: IRegion) => d.status?.toString(),
//     },
//     {
//         Header: 'имя типа',
//         accessor: (d: IRegion) => d.type?.name?.toString(),
//     },
//     // {
//     //     Header: 'родитель',
//     //     accessor: (d: IRegion) => d.parent?.id?.toString(),
//     // },
// ]

// export const regionExport = {
//     default: region,
//     full: region,
// }

// export const regionType = [
//     {
//         Header: 'id',
//         accessor: 'id',
//     },
//     {
//         Header: 'имя',
//         accessor: 'name',
//     },
// ]

// export const regionTypeExport = {
//     default: regionType,
//     full: regionType,
// }

export const systemMessage = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'slug',
        accessor: 'slug',
    },
    {
        Header: 'тип',
        accessor: 'type',
    },
    {
        Header: 'описание',
        accessor: 'desc',
    },
]

export const systemMessageExport = {
    default: systemMessage,
    full: systemMessage,
}

export const subscription = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'организация',
        accessor: 'org',
    },
    {
        Header: 'подписка',
        accessor: 'service',
    },
    {
        Header: 'дата начала',
        accessor: 'start_date',
    },
    {
        Header: 'дата конца',
        accessor: 'end_date',
    },
]

export const subscriptionExport = {
    default: subscription,
    full: subscription,
}

export const subscriptionService = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'цена',
        accessor: 'price',
    },
]

export const subscriptionServiceExport = {
    default: subscriptionService,
    full: subscriptionService,
}

export const subscriptionRequest = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'пользователь',
        accessor: 'user',
    },
    {
        Header: 'сервис',
        accessor: 'service',
    },
]

export const subscriptionRequestExport = {
    default: subscriptionRequest,
    full: subscriptionRequest,
}

export const user = [
    {
        Header: 'имя',
        accessor: 'fullname',
    },
    {
        Header: 'username',
        accessor: 'username',
    },
]

export const userExport = {
    default: user,
    full: user,
}

export const worker = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'username',
        id: 'user.username', //!
        accessor: (d: IWorker) => d.user?.username.toString(),
    },
]

export const workerExport = {
    default: worker,
    full: worker,
}

export const workerCard = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'карта',
        accessor: 'card',
    },
]

export const workerCardExport = {
    default: workerCard,
    full: workerCard,
}

export const workerDocs = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'дата начала',
        accessor: (d: IWorkerDocs) => convertDate(d.active_from),
    },
    {
        Header: 'дата конца',
        accessor: (d: IWorkerDocs) => convertDate(d.active_to),
    },
]

export const workerDocsExport = {
    default: workerDocs,
    full: workerDocs,
}

export const organizationNested = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'дата начала',
        accessor: 'from_date',
    },
    {
        Header: 'дата конца',
        accessor: 'to_date',
    },
    {
        Header: 'to_org',
        accessor: 'to_org',
    },
]

export const organizationNestedFull = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'дата начала',
        accessor: 'from_date',
    },
    {
        Header: 'дата конца',
        accessor: 'to_date',
    },
]

export const organizationNestedExport = {
    default: organizationNested,
    full: organizationNestedFull,
}

export const deviceNested = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        id: 'device.name', //!
        accessor: (d: IDeviceNested) => d.device?.name?.toString(),
    },
    {
        Header: 'тип',
        id: 'device.type', //!
        accessor: (d: IDeviceNested) => d.device?.type?.toString(),
    },
    {
        Header: 'описание',
        id: 'device.desc', //!
        accessor: (d: IDeviceNested) => d.device?.desc?.toString(),
    },
    {
        Header: 'device_id',
        id: 'device.id', //!
        accessor: (d: IDeviceNested) => d.device?.id?.toString(),
    },
]

export const deviceNestedExport = {
    default: deviceNested,
    full: deviceNested,
}

export const workingArea = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'имя',
        accessor: 'name',
    },
    {
        Header: 'локация',
        id: 'location.name', //!
        accessor: (d: IWorkingArea) => d.location?.name,
    },
    {
        Header: 'тип',
        id: 'type.name', //!
        accessor: (d: IWorkingArea) => d.type?.name,
    },
]

export const workingAreaExport = {
    default: workingArea,
    full: workingArea,
}

export const workingAreaSession = [
    {
        Header: 'id',
        accessor: 'id',
    },
    {
        Header: 'дата начала',
        accessor: 'start_date',
    },
    {
        Header: 'дата конца',
        accessor: 'end_date',
    },
    // {
    //     Header: 'количество',
    //     accessor: 'number',
    // },
    {
        Header: 'статус',
        id: 'status', //!
        accessor: (d: IWorkingAreaSession) =>
            (d.status === 0 ? 'Завершена' : 'В процессе'),
    },
    {
        Header: 'username',
        id: 'user.username', //!
        accessor: (d: IWorkingAreaSession) => d.user?.username,
    },
]

export const workingAreaSessionExport = {
    default: workingAreaSession,
    full: workingAreaSession,
}

export const sessionElement = [
    {
        Header: 'работник',
        id: 'worker.name', //!
        accessor: (d: ISessionElement) => d.worker?.name,
    },
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Пропуск выдан' : 'Пропуск сдан'),
    },
]

export const sessionElementExport = {
    default: sessionElement,
    full: sessionElement,
}

export const sessionRegisterElement = [
    {
        Header: 'работник',
        id: 'worker.name', //!
        accessor: (d: ISessionElement) => d.worker?.name,
    },
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    {
        Header: 'карта',
        accessor: (d: ISessionElement) => d.card,
    },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Пропуск выдан' : 'Пропуск сдан'),
    },
]

export const sessionRegisterElementExport = {
    default: sessionRegisterElement,
    full: sessionRegisterElement,
}

export const sessionSecurityElement = [
    {
        Header: 'работник',
        id: 'worker.name', //!
        accessor: (d: ISessionElement) => d.worker?.name,
    },
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    {
        Header: 'карта',
        accessor: (d: ISessionElement) => d.card,
    },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Пропуск выдан' : 'Пропуск сдан'),
    },
]

export const sessionSecurityElementExport = {
    default: sessionSecurityElement,
    full: sessionSecurityElement,
}

export const sessionRegisterInventoryElement = [
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    // {
    //     Header: 'карта',
    //     accessor: (d: ISessionElement) => d.card,
    // },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Пропуск выдан' : 'Пропуск сдан'),
    },
    {
        Header: 'инвентарь',
        id: 'inventory',
        accessor: (d: ISessionElement) => d.inventory,
    },
]

export const sessionRegisterInventoryElementExport = {
    default: sessionRegisterInventoryElement,
    full: sessionRegisterInventoryElement,
}

export const sessionInventoryElement = [
    {
        Header: 'работник',
        id: 'worker.name', //!
        accessor: (d: ISessionElement) => d.worker?.name,
    },
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    // {
    //     Header: 'карта',
    //     accessor: (d: ISessionElement) => d.card,
    // },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Пропуск выдан' : 'Пропуск сдан'),
    },
    {
        Header: 'инвентарь',
        id: 'inventory',
        accessor: (d: ISessionElement) => d.inventory,
    },
]

export const sessionInventoryElementExport = {
    default: sessionInventoryElement,
    full: sessionInventoryElement,
}

export const sessionKeyElement = [
    {
        Header: 'работник',
        id: 'worker.name', //!
        accessor: (d: ISessionElement) => d.worker?.name,
    },
    {
        Header: 'дата',
        id: 'date',
        accessor: (d: ISessionElement) => d.date,
    },
    // {
    //     Header: 'карта',
    //     accessor: (d: ISessionElement) => d.card,
    // },
    {
        Header: 'тип',
        id: 'mode',
        accessor: (d: ISessionElement) =>
            (d.mode ? 'Выдана' : 'Сдана'),
    },
    {
        Header: 'инвентарь',
        id: 'inventory',
        accessor: (d: ISessionElement) => d.inventory,
    },
]

export const sessionKeyElementExport = {
    default: sessionKeyElement,
    full: sessionKeyElement,
}

export default {
    deviceExport,
    // deviceTypeExport,
    locationExport,
    objectNestedLocationExport,
    inventoryExport,
    inventoryUploadExport,
    imageNestedInventoryExport,
    // organizationExport,
    permissionExport,
    permissionGroupExport,
    permissionLevelExport,
    // regionExport,
    // regionTypeExport,
    // subscriptionExport,
    // subscriptionServiceExport,
    // subscriptionRequestExport,
    // systemMessageExport,
    workerExport,
    workerCardExport,
    workerDocsExport,
    // userExport,
    // organizationNestedExport,
    // deviceNestedExport,
    workingAreaExport,
    workingAreaSessionExport,
    sessionElementExport,
    sessionRegisterElementExport,
    sessionSecurityElementExport,
    sessionRegisterInventoryElementExport,
    sessionInventoryElementExport,
    sessionKeyElementExport,
}
