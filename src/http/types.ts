import { IOrganization, IUser } from 'store/types';

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

export interface IGroupPermission {
    id: number;
    level: ILevel;
    name: string;
}

export interface IAdminGroupPermission {
    id: number;
    group: IGroupPermission;
    org: number;
}

export interface IResponse<T> {
    results: T[];
}

export interface IType {
    id: number;
    slug: string;
    name: string;
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

export interface IWorkingArea {
    id: number;
    location: ILocation;
    deleted: boolean;
    desc: string;
    name: string;
    type: IType;
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
    inventories: string;
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

export type GetOrgPermissions = (orgId: number) => Promise<IPermission[]>;

export type GetAdminOrgPermissions = (
    orgId: number
) => Promise<IResponse<IAdminPermission>>;

export type CreateOrgPermission = (
    obj: Omit<IPermissionObject, 'id'>
) => Promise<IPermissionObject>;

export type DeleteOrgPermission = (obj: { id: number; orgId: number }) => void;

export type GetGroupOrgPermissions = (
    orgId: number
) => Promise<IResponse<IGroupPermission>>;

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

export type GetLocationObjects = (
    orgId: number,
    locationId: number
) => Promise<IResponse<Omit<ILocation, 'isActive'>>>;

export type GenerateKeys = (
    locId: number,
    objId: number,
    body: KeyBody[]
) => Promise<IResponse<KeyBody>>;

export type GetWorkingAreaTypes = (orgId: number) => Promise<IResponse<IType>>;

export type GetAreaSessions = (
    orgId: number,
    areaId: number
) => Promise<IResponse<ISession>>;

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

export type GetWorkers = (orgId: number) => Promise<IResponse<IWorker>>;

export type GetWorkerDocs = (
    workerId: number,
    orgId: number
) => Promise<IResponse<IWorkerDocs>>;
