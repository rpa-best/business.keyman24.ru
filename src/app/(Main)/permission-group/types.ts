import { IGroupPermission, ILevel } from 'http/types';
import React from 'react';

export interface IModifiedPermissions extends IGroupPermission {
    levelDesc: string;
}

export interface PermGroupTableWrapperProps {
    permissions: IModifiedPermissions[];
    levels: ILevel[];
}

export interface IFormProps {
    level: ILevel[];
    formType: 'create' | 'edit';
    tableData: IModifiedPermissions[];
    setTableData: React.Dispatch<React.SetStateAction<IModifiedPermissions[]>>;
    selectedPerm?: IModifiedPermissions;
}
