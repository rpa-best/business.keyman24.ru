import {
    IAdminGroupPermission,
    IAdminPermission,
    IGroupPermission,
    IPermission,
} from 'http/types';
import { modes } from 'helpers/permTypeHelper';
import { CustomPermission } from 'app/(Main)/org-settings/components/PickListPermission/types';
import { v4 } from 'uuid';

const contains = (arr: IAdminPermission[], elem: CustomPermission) => {
    return (
        arr?.filter((i) => i.permission.id === elem.id && i.type === elem.type)
            .length === 0
    );
};

const containsGroup = (
    arr: IAdminGroupPermission[],
    elem: IGroupPermission
) => {
    return arr?.filter((i) => i.group.id === elem.id)?.length === 0;
};

export function getListValues(
    allValues: IPermission[],
    selectedValues: IAdminPermission[]
) {
    return allValues
        .map((perm) => {
            return modes.map((mode) => {
                return {
                    ...perm,
                    uuid: v4(),
                    type: mode.mode,
                    name: `${perm.name} `,
                    customDesc: mode.name,
                };
            });
        })
        .flat()
        .filter((item) => contains(selectedValues, item));
}

export function getGroupListValues(
    allValues: IGroupPermission[],
    adminValues: IAdminGroupPermission[]
) {
    return allValues
        .map((group) => {
            return {
                ...group,
                uuid: v4(),
                content: `${group?.name}`,
            };
        })
        .filter((item) => containsGroup(adminValues, item));
}
