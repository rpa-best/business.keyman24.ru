import { IAdminPermission, IPermission, PermissionType } from 'http/types';

export interface CustomAdminPermission extends IAdminPermission {
    customDesc: string;
    name: string;
}

export type CustomPermission = IPermission & {
    type: PermissionType;
    customDesc: string;
};
