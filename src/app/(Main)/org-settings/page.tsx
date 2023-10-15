import { PickListPermission } from 'app/(Main)/org-settings/components/PickListPermission';
import { PickListPermissionGroup } from 'app/(Main)/org-settings/components/PickListPermissionGroup';

import scss from './OrganizationSettings.module.scss';

const OrgSettingsPage = async () => {
    return (
        <div className={scss.custom_children}>
            <PickListPermission />
            <PickListPermissionGroup />
        </div>
    );
};

export default OrgSettingsPage;
