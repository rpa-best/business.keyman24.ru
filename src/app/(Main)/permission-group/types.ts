import { IGroupPermission, ILevel, IPermission } from 'http/types';

export interface IModifiedPermissions extends Omit<IGroupPermission, 'level'> {
    level: string;
}

export interface PermGroupTableWrapperProps {
    permissions: IModifiedPermissions[];
    initialPermissions: IGroupPermission[];
    levels: ILevel[];
}

export interface IFormProps {
    level: ILevel[];
    formType: 'create' | 'edit';
    selectedPerm?: IGroupPermission;
}
