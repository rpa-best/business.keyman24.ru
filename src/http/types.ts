import { IOrganization, IUser } from 'store/types';
import { boolean } from 'zod';

export interface IUserAuthRequest {
    username: string;
    password: string;
}

export interface IUserAuthResponse {
    access: string;
    refresh: string;
}

export type UserAuthType = (
    body: IUserAuthRequest
) => Promise<IUserAuthResponse | string | undefined | unknown>;

export type GetUserType = () => Promise<IUser | string | undefined>;

export type UpdateTokens = () => Promise<boolean>;

export type GetOrganizations = () => Promise<IOrganization[]>;

export type GetOrgById = (id?: number) => Promise<IOrganization>;

export interface ILevel {
    id: number;
    name: string;
}

export interface IPermissionObject {
    id: number;
    type: string;
    org: number;
    permission: number;
}

export type PermissionType = 'read' | 'delete' | 'update' | 'create';

export interface IPermission {
    id: number;
    level: ILevel;
    slug: string;
    name: string;
}

export interface IAdminPermission {
    id: number;
    org: number;
    permission: IPermission;
    type: PermissionType;
}

export interface IInventory {
    id: number;
    type: IType;
    comments: string;
    notZone: boolean;
    codeNumber: string;
    number: string;
    name: string;
    desc: string;
    codeImage: string;
    is_active: boolean;
    location: number;
    objectArea: number;
}

export interface IInventoryHistory {
    id: number;
    worker: IWorker;
    mode: boolean;
    date: string;
    card: string;
    comment: string;
    image: string;
    inventory: number;
}

export interface IGroupPermission {
    id: number;
    level: ILevel;
    name: string;
}

export interface IGroupPermPermissions {
    group: number;
    id: number;
    permission: IPermission;
    type: string;
}

export interface WorkerUserGroupPermission extends IGroupPermission {
    group: IGroupPermission;
}

export interface IAdminGroupPermission {
    id: number;
    group: IGroupPermission;
    org: number;
}

export interface IResponse<T> {
    results: T[];
    count: number;
}

export interface IType {
    id: number;
    slug: string;
    name: string;
    desc: string;
}

export interface ISessionUser extends Pick<IUser, 'avatar' | 'username'> {
    id: number;
    fullname: string;
    dateJoined: string;
    isOfficial: boolean;
}

export interface ILocation {
    id: number;
    deleted: boolean;
    isActive: boolean;
    desc: string;
    name: string;
}

export interface IObject extends Omit<ILocation, 'isActive'> {}

export interface IWorkingArea {
    id: number;
    location: ILocation;
    deleted: boolean;
    desc: string;
    name: string;
    type: IType;
}

export interface IWorkingAreaDevice {
    id: number;
    device: IDevice;
    area: number;
}

export interface SocketResponse {
    data: {
        device: number;
        mode: boolean;
        user: string;
        worker: IWorker;
    };
    type: 'success' | string;
}

export interface CreateWorkingAreaProp {
    deleted: boolean;
    location: number;
    name: string;
    type: string;
    desc: string;
}

export interface ISession {
    id: number;
    number: number;
    startDate: string;
    endDate: string;
    status: number;
    isActive: boolean;
    user: ISessionUser;
}

export interface IWorker {
    id: number;
    user: {
        id: number;
        fullname: string;
        avatar: string;
        username: string;
        dateJoined: string;
        isOfficial: string;
    };
    org: IOrganization;
    inventories: IInventory[];
    lc_id: number;
    name: string;
    user_lc_id: number;
    image: string;
}

export interface ICreateSessionBody
    extends Pick<ISession, 'id' | 'number' | 'status'> {
    start_date: string;
    end_date: string | null;
    user: string;
    is_active: boolean;
}

export interface IModifiedSession extends Omit<ISession, 'status'> {
    status: string;
}

export interface IDevice {
    id: number;
    type: string;
    name: string;
    desc: string;
    simValue: number;
}

export interface SessionLogResponse {
    id: number;
    worker: IWorker;
    mode: boolean;
    date: string;
    card: string;
    comment: string;
    image: string;
    inventory: number;
}

export interface IWorkerDocs {
    id: number;
    lcId: number;
    name: string;
    userLcId: number;
    activeFrom: string;
    activeTo: string;
    zp: string;
    orgLcId: number;
    worker: number;
}

export interface KeyBody {
    count: number;
    name: string;
}

export interface ReqInventoryBody extends Omit<IType, 'slug' | 'id'> {
    number: string;
    type: string;
}

export interface IInventoryImage {
    id: number;
    image: string;
    main: boolean;
    date: string;
}

export interface ICard {
    id: number;
    card: string;
}

export interface CreateGroupPermBody {
    level: number;
    name: string;
}

export interface CreateLocationBody {
    name: string;
    desc: string;
}

export interface ILocationOrgResponse {
    id: number;
    org: number;
    toOrg: {
        id: number;
        name: string;
        desc: string;
    };
}

export interface LocKeyBody {
    count: number;
    name: string;
}

export interface LocKeysResponse {
    id: number;
    type: IType;
    comments: string;
    notZone: boolean;
    codeNumber: string;
    number: string;
    name: string;
    desc: string;
    codeImage: string;
    isActive: boolean;
    location: number;
    objectArea: number;
}

export interface IWorkerUser {
    username: string;
    phone: string;
    name: string;
    lastname: string;
    surname: string;
    isActive: string;
}

export interface CreateWorkerUserBody {
    username: string;
    password1: string;
    password2: string;
    phone: string;
}

export interface LocationWorkerResponse {
    id: number;
    org: number;
    worker: IWorker;
}

export type GetOrgPermissions = (orgId: number) => Promise<IPermission[]>;

export type GetClientOrgPermissions = (
    level?: string
) => Promise<IPermission[]>;

export type GetLevels = (orgId: number) => Promise<IResponse<ILevel>>;

export type CreateGroupPerm = (body: CreateGroupPermBody) => Promise<void>;

export type EditGroupPerm = (
    permId: number,
    body: CreateGroupPermBody
) => Promise<void>;

export type DeleteGroupPerm = (permId: number) => Promise<void>;

export type GetAdminOrgPermissions = (
    orgId: number
) => Promise<IResponse<IAdminPermission>>;

export type CreateOrgPermission = (
    obj: Omit<IPermissionObject, 'id'>
) => Promise<IPermissionObject>;

export type CreateWorkerPermission = (obj: {
    permission: number;
    type: string;
    user: string;
}) => Promise<void>;

export type GetWorkerPermission = (
    orgId: number,
    username: string
) => Promise<IAdminPermission[]>;

export type DeleteWorkerPermission = (
    user: string,
    id: string
) => Promise<void>;

export type DeleteOrgPermission = (obj: { id: number; orgId: number }) => void;

export type GetGroupOrgPermissions = (
    orgId: number
) => Promise<IResponse<IGroupPermission>>;

export type GetPermGroupPermissions = (
    permGroup: number
) => Promise<IGroupPermPermissions[]>;

export type CreatePermGroupPermissions = (
    permGroup: number,
    permId: number,
    type: string
) => Promise<void>;

export type DeletePermGroupPermissions = (
    permGroup: number,
    permId: number
) => Promise<void>;

export type GetInventories = (
    orgId: number,
    offset?: number
) => Promise<IResponse<IInventory>>;

export type GetInventoryHistory = (
    orgId: number,
    inventoryId: number
) => Promise<IResponse<IInventoryHistory>>;

export type GetKeyHistory = (
    orgId: number,
    locId: number,
    objId: number,
    keyId: number
) => Promise<IResponse<IInventoryHistory>>;

export type GetInventoryTypes = (orgId: number) => Promise<IResponse<IType>>;

export type GetInventoryImage = (
    inventoryId: number
) => Promise<IResponse<IInventoryImage>>;

export type CreateInventoryCode = (body: LocKeyBody[]) => Promise<void>;

export type CreateInventoryItem = (body: ReqInventoryBody) => Promise<void>;

export type UpdateInventoryItem = (
    inventoryId: number,
    body: ReqInventoryBody
) => Promise<void>;

export type DeleteInventoryPhoto = (
    itemId: number,
    imageId: number
) => Promise<void>;

export type UploadInventoryPhoto = (
    itemId: number,
    photos: File
) => Promise<IInventoryImage>;

export type GetGroupAdminOrgPermissions = (
    orgId: number
) => Promise<IResponse<IAdminGroupPermission>>;

export type CreateGroupOrgPermission = (obj: {
    group: number;
    org: number;
}) => Promise<IPermissionObject>;

export type DeleteGroupOrgPermission = (obj: {
    id: number;
    orgId: number;
}) => void;

export type GetWorkingAreas = (
    orgId: number
) => Promise<IResponse<IWorkingArea>>;

export type GetLocations = (orgId: number) => Promise<IResponse<ILocation>>;

export type GetLocation = (orgId: number, locId: number) => Promise<ILocation>;

export type CreateLocation = (body: CreateLocationBody) => Promise<void>;

export type CreateLocationObject = (
    locId: number,
    body: CreateLocationBody
) => Promise<void>;

export type EditLocationObject = (
    locId: number,
    objId: number,
    body: CreateLocationBody
) => Promise<void>;

export type DeleteLocationObject = (
    locId: number,
    objId: number
) => Promise<void>;

export type GetLocationKeys = (
    orgId: number,
    locId: number,
    objId: number,
    params: {
        offset?: string;
        full?: boolean;
    }
) => Promise<IResponse<LocKeysResponse>>;

export type GetLocationClientKeys = (
    locId: number,
    objId: number
) => Promise<IResponse<LocKeysResponse>>;

export type CreateLocationKeys = (
    locId: number,
    objId: number,
    body: LocKeyBody[]
) => Promise<void>;

export type DeleteLocationKey = (
    locId: number,
    objId: number,
    invId: number
) => Promise<void>;

export type EditLocation = (
    locId: number,
    body: CreateLocationBody
) => Promise<void>;
export type DeleteLocation = (locId: number) => Promise<void>;

export type GetLocationObjects = (
    orgId: number,
    locationId: number
) => Promise<IResponse<IObject>>;

export type GetLocationWorkers = (
    orgId: number,
    locationId: number
) => Promise<IResponse<LocationWorkerResponse>>;

export type GetLocationOrganizations = (
    orgId: number,
    locationId: number
) => Promise<IResponse<ILocationOrgResponse>>;

export type CreateLocationOrg = (body: {
    location: number;
    to_org: number;
}) => Promise<void>;

export type CreateLocationWorker = (body: {
    location: number;
    worker: number;
}) => Promise<void>;

export type DeleteLocationOrg = (
    locationId: number,
    organizationId: number
) => Promise<void>;

export type DeleteLocationWorker = (
    locationId: number,
    workerId: number
) => Promise<void>;

export type GenerateKeys = (
    locId: number,
    objId: number,
    body: KeyBody[]
) => Promise<IResponse<KeyBody>>;

export type GetWorkingAreaTypes = (orgId: number) => Promise<IResponse<IType>>;

export type GetAreaSessions = (
    orgId: number,
    areaId: number,
    archive?: string
) => Promise<IResponse<ISession>>;

export type GetSessionLog = (
    orgId: number,
    areaId: number,
    sessionId: number
) => Promise<IResponse<SessionLogResponse>>;

export type CreateWorkingArea = (data: CreateWorkingAreaProp) => Promise<void>;

export type PatchWorkingArea = (
    data: CreateWorkingAreaProp,
    id: number
) => Promise<void>;

export type DeleteWorkingArea = (id: number) => Promise<void>;

export type CloseSession = (areaId: number, sessionId: number) => Promise<void>;

export type CreateSession = (
    areaId: number,
    body: ICreateSessionBody
) => Promise<void>;

export type SendCheckSession = (
    areaId: number,
    sessionId: number,
    body: { user: string; session: number }
) => Promise<void>;

export type SendSessionAction = (
    areaId: number,
    sessionId: number,
    body: {
        session: number;
        worker: number;
        barcode?: string;
        user?: string;
        mode?: boolean;
        device?: number;
    }
) => Promise<void>;

export type GetWorkers = () => Promise<IResponse<IWorker>>;

export type GetServerWorkers = (orgId: number) => Promise<IResponse<IWorker>>;

export type GetWorker = (orgId: number, workerId: number) => Promise<IWorker>;

export type GetWorkerUser = (
    orgId: number,
    workerId: number
) => Promise<IWorkerUser>;

export type CreateWorkerUser = (
    workerId: number,
    body: CreateWorkerUserBody
) => Promise<void>;

export type GetWorkerGroupUserPerm = (
    orgId: number,
    workerName: string
) => Promise<WorkerUserGroupPermission[]>;

export type CreateWorkerGroupUser = (
    workerName: string,
    body: { group: number }
) => Promise<void>;

export type DeleteWorkerGroupUser = (
    workerName: string,
    groupId: number
) => Promise<void>;

export type GetPermissions = (orgId: number) => Promise<IResponse<IPermission>>;

export type GetWorkerCard = (
    orgId: number,
    workerId: number
) => Promise<IResponse<ICard>>;

export type GetWorkerDocs = (
    workerId: number,
    orgId: number
) => Promise<IResponse<IWorkerDocs>>;

export type GetClientWorkerDocs = (
    workerId: number
) => Promise<IResponse<IWorkerDocs>>;

export type DeleteWorker = (workerId: number) => Promise<void>;

export type GetWorkingAreaDevices = (
    areaId: number
) => Promise<IResponse<IWorkingAreaDevice>>;

export type CreateWorkingAreaDevice = (
    areaId: number,
    body: { device: number; areaId: number }
) => Promise<void>;

export type DeleteWorkingAreaDevice = (
    areaId: number,
    deviceId: number
) => Promise<void>;

export type GetDevices = () => Promise<IResponse<IDevice>>;
