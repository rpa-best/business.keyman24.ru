import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import * as Device from '../models/device'
import * as Location from '../models/location'
import * as OrgNestedLocation from '../models/orgNestedLocation'
import * as Worker from '../models/worker'
import * as WorkerCard from '../models/workerCard'
import * as WorkerDocs from '../models/workerDocs'
import * as Permission from '../models/permission'
import * as Inventory from '../models/inventory'
import * as InventoryUpload from '../models/inventoryUpload'
import * as WorkingArea from '../models/workingArea'
import * as WorkingAreaSession from '../models/workingAreaSession'
import * as WorkingAreaType from '../models/workingAreaType'
import ApiService from '../services/ApiService'
import ReducerService from '../services/ReducerService'
import organizationReducer from './slices/organizationSlice'
import elementNestedSessionReducer from './slices/elementNestedSessionSlice'
import accountReducer from './slices/accountSlice'
import userReducer from './slices/userSlice'
import workerNestedElementReducer from './slices/workerNestedElementSlice'
import apiSlice from './api'
import { permissionGroupUserApi } from './api/permissionGroupUserApi'
import { permissionUserApi } from './api/permissionUserApi'
import { deviceNestedWorkingAreaApi } from './api/deviceNestedWorkingAreaApi'
import { sessionElementApi } from './api/sessionElementApi'
import { orgNestedOrgApi } from './api/orgNestedOrgApi'
import { workerNestedElementApi } from './api/workerNestedElementApi'
import { orgNestedLocationApi } from './api/orgNestedLocationApi'
import { workerNestedLocationApi } from './api/workerNestedLocationApi'

export const deviceReducer = new ReducerService<
    typeof Device.DeviceSchema,
    typeof Device.DeviceInputSchema
>({
    name: 'device',
    service: new ApiService<Device.IDevice, Device.IDeviceInput>({
        endpoint: 'device/',
    }),
    validationSchema: Device.DeviceSchema,
    validationInputSchema: Device.DeviceInputSchema,
})

export const locationReducer = new ReducerService<
    typeof Location.LocationSchema,
    typeof Location.LocationInputSchema
>({
    name: 'location',
    service: new ApiService<Location.ILocation, Location.ILocationInput>({
        endpoint: 'location/',
    }),
    validationSchema: Location.LocationSchema,
    validationInputSchema: Location.LocationInputSchema,
})

export const objectNestedLocationReducer = new ReducerService<
    typeof Location.LocationObjectSchema,
    typeof Location.LocationObjectInputSchema
>({
    name: 'objectNestedLocation',
    service: new ApiService<Location.ILocationObject, Location.ILocationObjectInput>({
        endpoint: 'location/',
    }),
    validationSchema: Location.LocationObjectSchema,
    validationInputSchema: Location.LocationObjectInputSchema,
})

export const orgNestedLocationReducer = new ReducerService<
    typeof OrgNestedLocation.OrgNestedLocationSchema,
    typeof OrgNestedLocation.OrgNestedLocationInputSchema
>({
    name: 'orgNestedLocation',
    service: new ApiService<OrgNestedLocation.IOrgNestedLocation, OrgNestedLocation.IOrgNestedLocationInput>({
        endpoint: 'location/',
    }),
    validationSchema: OrgNestedLocation.OrgNestedLocationSchema,
    validationInputSchema: OrgNestedLocation.OrgNestedLocationInputSchema,
})

export const workerReducer = new ReducerService<
    typeof Worker.WorkerSchema,
    typeof Worker.WorkerInputSchema
>({
    name: 'worker',
    service: new ApiService<Worker.IWorker, Worker.IWorkerInput>({
        endpoint: 'worker/',
    }),
    validationSchema: Worker.WorkerSchema,
    validationInputSchema: Worker.WorkerInputSchema,
})

export const workerCardReducer = new ReducerService<
    typeof WorkerCard.WorkerCardSchema,
    typeof WorkerCard.WorkerCardInputSchema
>({
    name: 'workerCard',
    service: new ApiService<WorkerCard.IWorkerCard, WorkerCard.IWorkerCardInput>({
        endpoint: 'worker/',
    }),
    validationSchema: WorkerCard.WorkerCardSchema,
    validationInputSchema: WorkerCard.WorkerCardInputSchema,
})

export const workerDocsReducer = new ReducerService<
    typeof WorkerDocs.WorkerDocsSchema,
    typeof WorkerDocs.WorkerDocsInputSchema
>({
    name: 'workerDocs',
    service: new ApiService<WorkerDocs.IWorkerDocs, WorkerDocs.IWorkerDocsInput>({
        endpoint: 'worker/',
    }),
    validationSchema: WorkerDocs.WorkerDocsSchema,
    validationInputSchema: WorkerDocs.WorkerDocsInputSchema,
})

export const permissionReducer = new ReducerService<
    typeof Permission.PermissionSchema,
    typeof Permission.PermissionInputSchema
>({
    name: 'permission',
    service: new ApiService<
        Permission.IPermission,
        Permission.IPermissionInput
    >({
        endpoint: 'permission/',
    }),
    validationSchema: Permission.PermissionSchema,
    validationInputSchema: Permission.PermissionInputSchema,
})

export const permissionGroupReducer = new ReducerService<
    typeof Permission.PermissionGroupSchema,
    typeof Permission.PermissionGroupInputSchema
>({
    name: 'permissionGroup',
    service: new ApiService<
        Permission.IPermissionGroup,
        Permission.IPermissionGroupInput
    >({
        endpoint: 'permission/group/',
    }),
    validationSchema: Permission.PermissionGroupSchema,
    validationInputSchema: Permission.PermissionGroupInputSchema,
})

export const permissionLevelReducer = new ReducerService<
    typeof Permission.PermissionLevelSchema,
    typeof Permission.PermissionLevelInputSchema
>({
    name: 'permissionLevel',
    service: new ApiService<
        Permission.IPermissionLevel,
        Permission.IPermissionLevelInput
    >({
        endpoint: 'permission/level/',
    }),
    validationSchema: Permission.PermissionLevelSchema,
    validationInputSchema: Permission.PermissionLevelInputSchema,
})

export const permissionNestedReducer = new ReducerService<
    typeof Permission.PermissionNestedSchema,
    typeof Permission.PermissionNestedInputSchema
>({
    name: 'permissionNested',
    service: new ApiService<
        Permission.IPermissionNested,
        Permission.IPermissionNestedInput
    >({
        endpoint: 'permission/group/',
    }),
    validationSchema: Permission.PermissionNestedSchema,
    validationInputSchema: Permission.PermissionNestedInputSchema,
})

export const inventoryReducer = new ReducerService<
    typeof Inventory.InventorySchema,
    typeof Inventory.InventoryInputSchema
>({
    name: 'inventory',
    service: new ApiService<Inventory.IInventory, Inventory.IInventoryInput>({
        endpoint: 'inventory/',
    }),
    validationSchema: Inventory.InventorySchema,
    validationInputSchema: Inventory.InventoryInputSchema,
})

export const inventoryTypeReducer = new ReducerService<
    typeof Inventory.InventoryTypeSchema,
    typeof Inventory.InventoryTypeInputSchema
>({
    name: 'inventoryType',
    service: new ApiService<Inventory.IInventoryType, Inventory.IInventoryTypeInput>({
        endpoint: 'inventory/type/',
    }),
    validationSchema: Inventory.InventoryTypeSchema,
    validationInputSchema: Inventory.InventoryTypeInputSchema,
})

export const inventoryUploadReducer = new ReducerService<
    typeof InventoryUpload.InventoryUploadSchema,
    typeof InventoryUpload.InventoryUploadInputSchema
>({
    name: 'inventoryUpload',
    service: new ApiService<InventoryUpload.IInventoryUpload, InventoryUpload.IInventoryUploadInput>({
        endpoint: 'inventory/upload/',
    }),
    validationSchema: InventoryUpload.InventoryUploadSchema,
    validationInputSchema: InventoryUpload.InventoryUploadInputSchema,
})

export const imageNestedInventoryReducer = new ReducerService<
    typeof Inventory.InventoryImageSchema,
    typeof Inventory.InventoryImageInputSchema
>({
    name: 'imageNestedInventory',
    service: new ApiService<Inventory.IInventoryImage, Inventory.IInventoryImageInput>({
        endpoint: 'inventory/',
    }),
    validationSchema: Inventory.InventoryImageSchema,
    validationInputSchema: Inventory.InventoryImageInputSchema,
})

export const workingAreaTypeReducer = new ReducerService<
    typeof WorkingAreaType.WorkingAreaTypeSchema,
    typeof WorkingAreaType.WorkingAreaTypeInputSchema
>({
    name: 'workingAreaType',
    service: new ApiService<WorkingAreaType.IWorkingAreaType, WorkingAreaType.IWorkingAreaTypeInput>({
        endpoint: 'working_area/type/',
    }),
    validationSchema: WorkingAreaType.WorkingAreaTypeSchema,
    validationInputSchema: WorkingAreaType.WorkingAreaTypeInputSchema,
})

export const workingAreaReducer = new ReducerService<
    typeof WorkingArea.WorkingAreaSchema,
    typeof WorkingArea.WorkingAreaInputSchema
>({
    name: 'workingArea',
    service: new ApiService<WorkingArea.IWorkingArea, WorkingArea.IWorkingAreaInput>({
        endpoint: 'working_area/',
    }),
    validationSchema: WorkingArea.WorkingAreaSchema,
    validationInputSchema: WorkingArea.WorkingAreaInputSchema,
})

export const sessionNestedWorkingAreaReducer = new ReducerService<
    typeof WorkingAreaSession.WorkingAreaSessionSchema,
    typeof WorkingAreaSession.WorkingAreaSessionInputSchema
>({
    name: 'sessionNestedWorkingArea',
    service: new ApiService<WorkingAreaSession.IWorkingAreaSession, WorkingAreaSession.IWorkingAreaSessionInput>({
        endpoint: 'working_area/',
    }),
    validationSchema: WorkingAreaSession.WorkingAreaSessionSchema,
    validationInputSchema: WorkingAreaSession.WorkingAreaSessionInputSchema,
})

export const permissionAdminReducer = new ReducerService<
    typeof Permission.PermissionToAdminListSchema,
    typeof Permission.PermissionAdminInputSchema
>({
    name: 'permissionAdmin',
    service: new ApiService<
        Permission.IPermissionAdmin,
        Permission.IPermissionAdminInput
    >({
        endpoint: 'permission/admin/',
    }),
    validationSchema: Permission.PermissionToAdminListSchema,
    validationInputSchema: Permission.PermissionAdminInputSchema,
})

export const permissionGroupAdminReducer = new ReducerService<
    typeof Permission.PermissionGroupToAdminSchema,
    typeof Permission.PermissionGroupToAdminInputSchema
>({
    name: 'permissionGroupAdmin',
    service: new ApiService<
        Permission.IPermissionGroupToAdmin,
        Permission.IPermissionGroupToAdminInput
    >({
        endpoint: 'permission/admin/group/',
    }),
    validationSchema: Permission.PermissionGroupToAdminSchema,
    validationInputSchema: Permission.PermissionGroupToAdminInputSchema,
})

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        account: accountReducer,
        org: organizationReducer,
        user: userReducer,
        elementNestedSession: elementNestedSessionReducer,
        workerNestedElement: workerNestedElementReducer,
        device: deviceReducer.slice().reducer,
        location: locationReducer.slice().reducer,
        objectNestedLocation: objectNestedLocationReducer.slice().reducer,
        orgNestedLocation: orgNestedLocationReducer.slice().reducer,
        worker: workerReducer.slice().reducer,
        workerCard: workerCardReducer.slice().reducer,
        workerDocs: workerDocsReducer.slice().reducer,
        permission: permissionReducer.slice().reducer,
        permissionGroup: permissionGroupReducer.slice().reducer,
        permissionLevel: permissionLevelReducer.slice().reducer,
        permissionNestedPermissionGroup:
            permissionNestedReducer.slice().reducer,
        [permissionGroupUserApi.reducerPath]: permissionGroupUserApi.reducer,
        [permissionUserApi.reducerPath]: permissionUserApi.reducer,
        inventory: inventoryReducer.slice().reducer,
        inventoryType: inventoryTypeReducer.slice().reducer,
        inventoryUpload: inventoryUploadReducer.slice().reducer,
        imageNestedInventory: imageNestedInventoryReducer.slice().reducer,
        workingAreaType: workingAreaTypeReducer.slice().reducer,
        workingArea: workingAreaReducer.slice().reducer,
        sessionNestedWorkingArea: sessionNestedWorkingAreaReducer.slice().reducer,
        [deviceNestedWorkingAreaApi.reducerPath]: deviceNestedWorkingAreaApi.reducer,
        [sessionElementApi.reducerPath]: sessionElementApi.reducer,
        [orgNestedOrgApi.reducerPath]: orgNestedOrgApi.reducer,
        [workerNestedElementApi.reducerPath]: workerNestedElementApi.reducer,
        [orgNestedLocationApi.reducerPath]: orgNestedLocationApi.reducer,
        [workerNestedLocationApi.reducerPath]: workerNestedLocationApi.reducer,
        permissionAdmin: permissionAdminReducer.slice().reducer,
        permissionGroupAdmin: permissionGroupAdminReducer.slice().reducer,
    },
    devTools: true,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    // .concat(permissionGroupUserApi.middleware)
    // .concat(permissionUserApi.middleware)
    // .concat(deviceNestedWorkingAreaApi.middleware)
    // .concat(sessionElementApi.middleware)
    // .concat(orgNestedLocationApi.middleware)
    // .concat(workerNestedLocationApi.middleware)
})
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
