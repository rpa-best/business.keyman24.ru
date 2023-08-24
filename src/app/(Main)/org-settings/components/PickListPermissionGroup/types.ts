import { IGroupPermission } from 'http/types';

export interface CustomGroupAdminPermission {
    content: string;
    id: number;
    org: number;
    group: IGroupPermission;
}
