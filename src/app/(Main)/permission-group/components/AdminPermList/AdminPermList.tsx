import React, { useEffect, useState } from 'react';

import { CustomGroupDefaultElem } from 'app/(Main)/permission-group/components/PermissionPickList/types';

import scss from './AdminPermList.module.scss';
import { fetchData } from 'app/(Main)/permission-group/components/PermModalForm/fetchData';

interface AdminPermListProps {
    id: number;
    levelId: number;
}

export const AdminPermList: React.FC<AdminPermListProps> = ({
    levelId,
    id,
}) => {
    const [source, setSource] = useState<CustomGroupDefaultElem[]>([]);

    useEffect(() => {
        fetchData(id as number, levelId as number).then((d) => {
            setSource(d.src as []);
        });
    }, [id, levelId]);

    return (
        <>
            <h3 className={scss.perm_list_title}>Разрешённые права</h3>
            <div className={scss.admin_list_wrapper}>
                {source.map((item, index) => {
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
