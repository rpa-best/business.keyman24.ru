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

export interface IService {
    id: number;
    status: 'active' | 'notActive';
    user: string;
    org: number;
    serviceRates: IServiceRate[];
}

export interface IServiceRate {
    id: number;
    key: IServiceRateKey;
    value: number;
    notLimited: boolean;
    subs: number;
}

export interface IServiceRateKey {
    modelName: string;
    name: string;
    defaultValue: number;
    maxValue: number;
    cost: number;
    costNotLimited: number;
}

export interface IRate {
    id: number;
    key: string;
    value: number;
    not_limited: boolean;
}

export interface IBalanceHistory {
    id: number;
    cost: number;
    date: string;
    type: string;
    data: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
    };
    org: number;
}

export type UserAuthType = (
    body: IUserAuthRequest
) => Promise<IUserAuthResponse>;

export type GetUserType = (
    access: string
) => Promise<IUser | string | undefined>;

export type UpdateTokens = () => Promise<boolean>;

export type ChangePassword = (
    pvc: string,
    email: string,
    password1: string,
    password2: string
) => Promise<boolean>;

export type GetOrganizations = () => Promise<IOrganization[]>;

export type GetOrganizationContractors = (
    orgId: number
) => Promise<IOrganization[]>;

export type GetOrganizationContractorsOnClient = GetOrganizations;

export type GetOrgById = (id?: number) => Promise<IOrganization>;

export type GetServices = (org: number) => Promise<IService>;

export type GetPrice = (
    body: IRate[]
) => Promise<{ body: string[]; cost: number }>;

export type GetPriceBySlug = (
    slug: string
) => Promise<{ costNotLimited: number; cost: number }>;

export type GetServerPriceBySlug = (
    orgId: number,
    slug: string
) => Promise<{ costNotLimited: number; cost: number }>;

export type GetHistory = (orgId: number) => Promise<IResponse<IBalanceHistory>>;

export type UpdatePrice = (body: IRate[]) => Promise<void>;

export type TopUpBalance = (summa: number) => Promise<{ word: string }>;

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
    id: string;
    level: ILevel;
    slug: string;
    name: string;
}

export interface IAdminPermission {
    id: string;
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
    location: ILocation;
    objectArea: IObject;
}

export interface IInventoryHistory {
    id: number;
    worker: IWorker;
    mode: boolean;
    date: string;
    card: string;
    comment: string;
    image: string;
    inventory: IInventory;
}

export interface IGroupPermission {
    id: number;
    uuid: string;
    level: ILevel;
    name: string;
    org: number;
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
    timezone: string;
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

interface WorkerWithoutUser extends Omit<IWorker, 'user'> {
    user: string;
}

export interface SocketResponse {
    data: {
        device: number;
        use_session: boolean;
        mode: boolean;
        user: IWorker | string;
        worker: IWorker;
        inventory?: IInventory[];
        error: {
            slug: string;
            name: string;
        };
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

export interface IPlanObj {
    in: string[];
    out: string[];
    workedTime: number;
}

export interface IPlan {
    [key: string]: IPlanObj;
}

export interface IWorkerPlan {
    id: number;
    plan: IPlan;
    lcId: number;
    name: string;
    userLcId: number;
    image: string;
    user: string;
    org: number;
}

export interface ICreateSessionBody
    extends Pick<ISession, 'number' | 'status'> {
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
    inventory: IInventory;
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
    timezone: string;
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
    isActive: boolean;
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

export interface MainCardsData {
    keyCount: number;
    inventoryCount: number;
    workerCount: number;
    keyTaken: number;
    inventoryTaken: number;
    workerTaken: number;
}

export interface LineChartObject {
    [key: string]: {
        entersCount: number;
        exitCount: number;
        uniqueCount: number;
    };
}

export interface LineChartData {
    byHour: LineChartObject;
    byDay: LineChartObject;
    byWeek: LineChartObject;
    byMonth: LineChartObject;
}

export type GetMainCardsStatistics = (orgId: number) => Promise<MainCardsData>;

interface QueryType {
    orgs?: string;
    location?: string;
    date_lt: string;
    date_gt: string;
}

export type GetLineChartData = (
    orgId: number,
    query: QueryType
) => Promise<LineChartData>;

export type GetOrgPermissions = (orgId: number) => Promise<IPermission[]>;

export type GetOrgPermissionsOnClient = () => Promise<IPermission[]>;

export type GetClientOrgPermissions = (
    level?: string
) => Promise<IPermission[]>;

export type GetLevels = (orgId: number) => Promise<IResponse<ILevel>>;

export type CreateGroupPerm = (
    body: CreateGroupPermBody
) => Promise<IGroupPermission>;

export type EditGroupPerm = (
    permId: number,
    body: CreateGroupPermBody
) => Promise<void>;

export type DeleteGroupPerm = (permId: number) => Promise<void>;

export type GetAdminOrgPermissions = (
    orgId: number
) => Promise<IResponse<IAdminPermission>>;

export type GetAdminOrgPermissionsOnClient = () => Promise<
    IResponse<IAdminPermission>
>;

export type CreateOrgPermission = (
    obj: Omit<IPermissionObject, 'id' | 'org'>
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

export type GetWorkerPermissionOnClient = (
    username: string
) => Promise<IAdminPermission[]>;

export type GetWorkerGroupPermissionOnClient = (
    username: string
) => Promise<WorkerUserGroupPermission[]>;

export type DeleteWorkerPermission = (
    user: string,
    id: string
) => Promise<void>;

export type DeleteOrgPermission = (obj: { id: number }) => void;

export type GetGroupOrgPermissions = (
    orgId: number
) => Promise<IResponse<IGroupPermission>>;

export type GetGroupOrgPermissionsOnClient = () => Promise<
    IResponse<IGroupPermission>
>;

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
    offset: number,
    name: string,
    location: string
) => Promise<IResponse<IInventory>>;

export type GetClientInventories = (
    name: string,
    location?: string,
    isPdf?: boolean
) => Promise<IResponse<IInventory>>;

export type GetInventoryHistory = (
    orgId: number,
    inventoryId: number,
    offset: number,
    register?: boolean
) => Promise<IResponse<IInventoryHistory>>;

export type GetKeyHistory = (
    orgId: number,
    locId: number,
    objId: number,
    keyId: number,
    offset: number
) => Promise<IResponse<IInventoryHistory>>;

export type GetInventoryTypes = (orgId: number) => Promise<IResponse<IType>>;

export type GetInventoryImage = (
    inventoryId: number
) => Promise<IResponse<IInventoryImage>>;

export type CreateInventoryCode = (body: LocKeyBody[]) => Promise<void>;

export type CreateInventoryItem = (
    body: ReqInventoryBody
) => Promise<IInventory>;

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

export type HeadCheck = (
    path: string,
    link: string,
    orgId: number
) => Promise<string | undefined>;

export type HeadCheckMiddleWare = (
    path: string,
    link: string,
    access: string,
    orgId: number
) => Promise<string | void>;

export type AllowedPath = (path: string, org: string) => Promise<boolean>;

export type GetGroupAdminOrgPermissions = (
    orgId: number
) => Promise<IResponse<IAdminGroupPermission>>;

export type GetGroupAdminOrgPermissionsOnClient = () => Promise<
    IResponse<IAdminGroupPermission>
>;

export type CreateGroupOrgPermission = (obj: {
    group: number;
}) => Promise<IPermissionObject>;

export type DeleteGroupOrgPermission = (obj: { id: number }) => void;

export type GetWorkingAreas = (
    orgId: number
) => Promise<IResponse<IWorkingArea>>;

export type GetLocations = (orgId: number) => Promise<IResponse<ILocation>>;

export type GetLocationsOnClient = () => Promise<IResponse<ILocation>>;

export type GetLocation = (orgId: number, locId: number) => Promise<ILocation>;

export type CreateLocation = (body: CreateLocationBody) => Promise<ILocation>;

export type CreateLocationObject = (
    locId: number,
    body: { name: string; desc: string }
) => Promise<IObject>;

export type EditLocationObject = (
    locId: number,
    objId: number,
    body: { name: string; desc: string }
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
        name: string;
    }
) => Promise<IResponse<LocKeysResponse>>;

export type GetLocationClientKeys = (
    locId: number,
    objId: number,
    name?: string,
    pdf?: boolean
) => Promise<IResponse<LocKeysResponse>>;

export type CreateLocationKeys = (
    locId: number,
    objId: number,
    body: LocKeyBody[]
) => Promise<IResponse<LocKeysResponse>>;

export type DeleteLocationKey = (
    locId: number,
    objId: number,
    invId: number
) => Promise<void>;

export type EditLocation = (
    locId: number,
    body: CreateLocationBody
) => Promise<ILocation>;
export type DeleteLocation = (locId: number) => Promise<void>;

export type GetLocationObjects = (
    orgId: number,
    locationId: number
) => Promise<IResponse<IObject>>;

export type GetLocationWorkers = (
    orgId: number,
    locationId: number
) => Promise<IResponse<LocationWorkerResponse>>;

export type GetLocationWorkersOnClient = (
    locationId: number
) => Promise<IResponse<LocationWorkerResponse>>;

export type GetLocationOrganizations = (
    orgId: number,
    locationId: number
) => Promise<IResponse<ILocationOrgResponse>>;

export type GetLocationOrganizationsOnClient = (
    locationId: number
) => Promise<IResponse<ILocationOrgResponse>>;

export type CreateLocationOrg = (body: {
    location: number;
    to_org: number;
}) => Promise<{ id: number }>;

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

export type CreateWorkingArea = (
    data: CreateWorkingAreaProp
) => Promise<IWorkingArea>;

export type PatchWorkingArea = (
    data: CreateWorkingAreaProp,
    id: number
) => Promise<void>;

export type DeleteWorkingArea = (id: number) => Promise<void>;

export type CloseSession = (areaId: number, sessionId: number) => Promise<void>;

export type CreateSession = (
    areaId: number,
    body: ICreateSessionBody
) => Promise<ISession>;

export type SendCheckSession = (
    areaId: number,
    sessionId: number,
    body: { user: string; session: number }
) => Promise<void>;

export type SendActivateSession = (
    areaId: number,
    sessionId: number
) => Promise<void>;

export type SendSessionAction = (
    areaId: number,
    sessionId: number,
    body: {
        session: number;
        worker?: number;
        barcode?: string;
        user?: string;
        mode?: boolean;
        device?: number;
    }
) => Promise<SessionLogResponse>;

export type GetWorkers = (orgId?: number) => Promise<IResponse<IWorker>>;

export type GetWorkerPlan = (
    orgId: number,
    workerId: number
) => Promise<IWorkerPlan>;

export type GetWorkersPlan = (query?: {
    date_from?: string;
    date_end?: string;
    org?: string;
    [key: string]: string | undefined;
}) => Promise<File>;

export type GetServerWorkers = (orgId: number) => Promise<IResponse<IWorker>>;

export type GetWorker = (orgId: number, workerId: number) => Promise<IWorker>;

export type GetWorkerUser = (
    orgId: number,
    workerId: number
) => Promise<IWorkerUser>;

export interface errorsResponse {
    phone?: string;
}

export type CreateWorkerUser = (
    workerId: number,
    body: CreateWorkerUserBody
) => Promise<errorsResponse | void>;

export type EditWorkerUser = (
    workerId: number,
    body: Omit<CreateWorkerUserBody, 'password1' | 'password2'>
) => Promise<errorsResponse | void>;

export type GetWorkerGroupUserPerm = (
    orgId: number,
    workerName: string
) => Promise<WorkerUserGroupPermission[]>;

export type GetWorkerGroupUserPermOnClient = (
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
