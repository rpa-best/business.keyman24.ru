import { cookies } from 'next/headers';

import { getOrgById } from 'http/organizationApi';
import { PickListPermission } from 'app/(Main)/org-settings/components/PickListPermission';
import { PickListPermissionGroup } from 'app/(Main)/org-settings/components/PickListPermissionGroup';
import {
    getAdminPermissions,
    getGroupAdminPermissions,
    getGroupPermissions,
    getPermissions,
} from 'http/permissionsApi';
import {
    getGroupListValues,
    getListValues,
} from 'components/PickList/helpers/getListValues';
import { getModeName } from 'helpers/permTypeHelper';

import scss from './OrganizationSettings.module.scss';
import { SettingsButton } from 'app/(Main)/org-settings/components/ButtonWrapper/SettingsButton';

const OrgSettingsPage = async () => {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value ?? 1;

    const org = await getOrgById(+id);

    const allPermissions = await getPermissions(+id as number);

    const allAdminPermissions = await getAdminPermissions(+id as number);

    const allGroupPermissions = await getGroupPermissions(+id as number);

    const allGroupAdminPermissions = await getGroupAdminPermissions(
        +id as number
    );

    const permissionSource = getListValues(
        allPermissions,
        allAdminPermissions.results
    );
    const permissionTarget = allAdminPermissions.results.map((perm) => {
        return {
            ...perm,
            name: `${perm?.permission?.name}`,
            customDesc: getModeName(perm?.type),
        };
    });

    const groupPermissionSource = getGroupListValues(
        allGroupPermissions.results,
        allGroupAdminPermissions.results
    );

    const groupPermissionTarget = allGroupAdminPermissions.results.map(
        (perm) => {
            return {
                ...perm,
                content: `${perm?.group?.name}`,
            };
        }
    );

    return (
        <div
            style={{ marginBottom: '20px' }}
            className={scss.children_with_table}
        >
            <div className={scss.default_wrapper}>
                <SettingsButton />
                <h2 className={scss.title}>{org.name}</h2>
            </div>

            <PickListPermission
                orgId={+id}
                permissions={permissionSource}
                adminPermissions={permissionTarget}
            />

            <PickListPermissionGroup
                permissions={groupPermissionSource}
                adminPermissions={groupPermissionTarget}
                orgId={+id}
            />
        </div>
    );
};

export default OrgSettingsPage;
