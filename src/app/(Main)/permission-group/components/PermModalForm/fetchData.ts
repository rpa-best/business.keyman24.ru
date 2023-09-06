import {
    getClientPermissions,
    getPermissionGroupPermission,
} from 'http/permissionsApi';
import { getListValues } from 'components/PickList/helpers/getListValues';
import { getModeName } from 'helpers/permTypeHelper';

export const fetchData = async (id: number, level: number) => {
    const allPermissions = await getClientPermissions(level.toString());

    const selectedPermissions = await getPermissionGroupPermission(
        id as number
    );

    const permissionTarget = getListValues(
        allPermissions,
        selectedPermissions as any
    );

    const permissionSource = selectedPermissions.map((perm) => {
        return {
            ...perm,
            name: `${perm?.permission?.name}`,
            customDesc: getModeName(perm?.type as any),
        };
    });

    return {
        src: permissionSource,
        trg: permissionTarget,
    };
};
