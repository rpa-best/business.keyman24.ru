import { cookies } from 'next/headers';

import { getOrgById } from 'http/organizationApi';
import { PickListPermission } from 'app/(Main)/org-settings/components/PickListPermission';
import { PickListPermissionGroup } from 'app/(Main)/org-settings/components/PickListPermissionGroup';

import scss from './OrganizationSettings.module.scss';
import {
    getAdminPermissions,
    getGroupAdminPermissions,
    getGroupPermissions,
    getPermissions,
} from 'http/permissionsApi';

const OrgSettingsPage = async () => {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value ?? 1;

    const name = await getOrgById(+id).then((r) => r.name);

    const allPermissions = await getPermissions(+id as number);

    const allAdminPermissions = await getAdminPermissions(+id as number);

    const allGroupPermissions = await getGroupPermissions(+id as number);

    const allGroupAdminPermissions = await getGroupAdminPermissions(
        +id as number
    );

    return (
        <div className={scss.settings_wrapper}>
            <div className={scss.default_wrapper}>
                <h2 className={scss.title}>{name}</h2>
            </div>

            <PickListPermission
                orgId={+id}
                permissions={allPermissions}
                adminPermissions={allAdminPermissions.results}
            />

            <PickListPermissionGroup
                permissions={allGroupPermissions.results}
                adminPermissions={allGroupAdminPermissions.results}
                orgId={+id}
            />
        </div>
    );
};

export default OrgSettingsPage;
