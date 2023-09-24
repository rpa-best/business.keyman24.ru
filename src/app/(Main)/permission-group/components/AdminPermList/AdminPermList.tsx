import React from 'react';

import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';

import scss from './AdminPermList.module.scss';

interface AdminPermListProps {
    list: CustomGroupDefaultElem[];
}

export const AdminPermList: React.FC<AdminPermListProps> = ({ list }) => {
    return (
        <>
            <h3 className={scss.perm_list_title}>Разрешённые права</h3>
            <div className={scss.admin_list_wrapper}>
                {list.map((item, index) => {
                    return (
                        <div className={scss.admin_list_item} key={index}>
                            <p className={scss.item_name}>{item.name}</p>
                            <p className={scss.item_desc}>{item.customDesc}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
