import { cookies } from 'next/headers';

import {
    getAdminOrganizationPermissions,
    getGroupAdminOrgPermissions,
    getGroupOrgPermissions,
    getOrganizationPermissions,
    getOrgById,
} from 'http/organizationApi';
import { PickListPermission } from 'app/(Main)/org-settings/components/PickListPermission';
import { PickListPermissionGroup } from 'app/(Main)/org-settings/components/PickListPermissionGroup';

import scss from './OrganizationSettings.module.scss';

const OrgSettingsPage = async () => {
    const cookieStore = cookies();

    const id = cookieStore.get('orgId')?.value ?? 1;

    const name = await getOrgById(+id).then((r) => r.name);

    const allPermissions = await getOrganizationPermissions(+id as number);

    const allAdminPermissions = await getAdminOrganizationPermissions(
        +id as number
    );

    const allGroupPermissions = await getGroupOrgPermissions(+id as number);

    const allGroupAdminPermissions = await getGroupAdminOrgPermissions(
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
