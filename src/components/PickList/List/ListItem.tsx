import React from 'react';
import clsx from 'clsx';

import { DefaultElem } from 'components/PickList/types';

import scss from 'components/PickList/List/List.module.scss';

interface ListItemProps {
    selected?: DefaultElem[];
    item: DefaultElem;
    handleItemClick: (elem: DefaultElem) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
    item,
    selected,
    handleItemClick,
}) => {
    const listItemClassname = clsx({
        [scss.list_item]: !selected?.includes(item),
        [scss.list_item_active]: selected?.includes(item),
    });

    if (!item) {
        return null;
    }

    return (
        <li onClick={() => handleItemClick(item)} className={listItemClassname}>
            <div className={scss.elem_wrapper}>
                {item?.content ? (
                    <p className={scss.elem_name}>{item.content}</p>
                ) : (
                    <>
                        <p className={scss.elem_name}>{item.name}</p>
                        <p className={scss.elem_desc}>{item.customDesc}</p>
                    </>
                )}
            </div>
        </li>
    );
};
