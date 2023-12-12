import { IGroupPermission, ILevel, PermissionsResponseType } from 'http/types';
import React from 'react';

export interface IModifiedPermissions extends IGroupPermission {
    levelDesc: string;
}

export interface PermGroupTableWrapperProps {
    permissions: IModifiedPermissions[];
    levels: ILevel[];
    allowedPermissions: PermissionsResponseType[];
    count: number;
}

export interface IFormProps {
    level: ILevel[];
    formType: 'create' | 'edit';
    setTableData: React.Dispatch<React.SetStateAction<IModifiedPermissions[]>>;
    selectedPerm?: IModifiedPermissions;
}
