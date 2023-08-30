import React from 'react';

import { ListItem } from 'components/PickList/List/ListItem';
import { ListProps } from 'components/PickList/types';

import scss from './List.module.scss';

export const List: React.FC<ListProps> = ({
    handleItemClick,
    items,
    selected,
}) => {
    return (
        <ul className={scss.list_wrapper}>
            {items?.length === 0 ? (
                <div className={scss.empty}>Пустой список</div>
            ) : (
                items?.map((item, index) => (
                    <ListItem
                        key={index}
                        item={item}
                        handleItemClick={handleItemClick}
                        selected={selected}
                    />
                ))
            )}
        </ul>
    );
};
