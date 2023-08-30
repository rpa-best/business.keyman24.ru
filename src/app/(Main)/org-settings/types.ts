import { IAdminPermission, IPermission } from 'http/types';
import { IOrganization } from 'store/types';

export interface PickListPermissionProps {
    permissions: IPermission[];
    adminPermissions: IAdminPermission[];
    orgId: number;
}
