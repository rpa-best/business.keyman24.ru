import { cookies } from 'next/headers';

import { getGroupPermissions, getPermLevels } from 'http/permissionsApi';
import { PermGroupTableWrapper } from 'app/(Main)/permission-group/components/PermGroupTableWrapper';

import scss from './PermGroup.module.scss';

const PermissionGroupPage = async ({
    searchParams,
}: {
    searchParams: { offset: string };
}) => {
    const cookieStore = cookies();

    const orgId = cookieStore.get('orgId')?.value as string;

    const offset = searchParams.offset ?? '0';

    const permissions = await getGroupPermissions(+orgId, offset);

    const levels = await getPermLevels(+orgId);

    const modifiedPermissions = permissions.results.map((p) => {
        return { ...p, levelDesc: p.level.name };
    });

    return (
        <div className={scss.children_with_table}>
            <h1 className={scss.page_title_with_table}>
                Права доступа / список
            </h1>
            <PermGroupTableWrapper
                allowedPermissions={permissions.permissions}
                levels={levels?.results}
                count={permissions.count}
                permissions={modifiedPermissions}
            />
        </div>
    );
};

export default PermissionGroupPage;
