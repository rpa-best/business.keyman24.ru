import { ILocation, PermissionsResponseType } from 'http/types';
import { TableProps } from 'components/Table/types';
import { IOrganization } from 'store/types';

export interface TableWrapperProps {
    tableRows: ILocation[];
    children: TableProps['children'];
    path?: string;
    organizations: IOrganization[];
    allowedPermissions: PermissionsResponseType[];
    count: number;
}
