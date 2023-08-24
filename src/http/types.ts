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

export interface ILocation {
    id: number;
    deleted: boolean;
    isActive: boolean;
    name: string;
}

export interface IWorkingArea {
    id: number;
    location: ILocation;
    deleted: boolean;
    name: string;
    type: IType;
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

export type GetWorkingAreaTypes = (orgId: number) => Promise<IResponse<IType>>;
