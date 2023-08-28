import React from 'react';

import { DefaultElem } from 'components/PickList/PickList';

import scss from './List.module.scss';
import clsx from 'clsx';
import { ListItem } from 'components/PickList/List/ListItem';

interface ListProps {
    selected?: DefaultElem[];
    items?: DefaultElem[];
    handleItemClick: (elem: DefaultElem) => void;
}

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
