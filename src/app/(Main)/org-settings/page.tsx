import { cookies } from 'next/headers';

import { getOrgById } from 'http/organizationApi';
import { PickListPermission } from 'app/(Main)/org-settings/components/PickListPermission';
import { PickListPermissionGroup } from 'app/(Main)/org-settings/components/PickListPermissionGroup';
import {
    getAdminPermissions,
    getAdminPermissionsOnClient,
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

    return (
        <div
            style={{ marginBottom: '20px' }}
            className={scss.children_with_table}
        >
            <div className={scss.default_wrapper}>
                <SettingsButton />
                <h2 className={scss.title}>{org.name}</h2>
            </div>
            <PickListPermission />
            <PickListPermissionGroup />
        </div>
    );
};

export default OrgSettingsPage;
