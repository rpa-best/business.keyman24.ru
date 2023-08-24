import React from 'react';

import { DefaultElem } from 'components/PickList/PickList';

import scss from './List.module.scss';

interface ListProps {
    selected: DefaultElem[];
    items: DefaultElem[];
    handleArrClick: (elem: DefaultElem) => void;
}

export const List: React.FC<ListProps> = ({
    handleArrClick,
    items,
    selected,
}) => {
    return (
        <ul className={scss.list_wrapper}>
            {items?.length === 0 ? (
                <div className={scss.empty}>Пустой список</div>
            ) : (
                items?.map((item, index) => {
                    return (
                        <li
                            key={index}
                            onClick={() => handleArrClick(item)}
                            className={
                                selected.includes(item)
                                    ? scss.list_item_active
                                    : scss.list_item
                            }
                        >
                            <div className={scss.elem_wrapper}>
                                {item.content ? (
                                    <p className={scss.elem_name}>
                                        {item.content}
                                    </p>
                                ) : (
                                    <>
                                        <p className={scss.elem_name}>
                                            {item.name}
                                        </p>
                                        <p className={scss.elem_desc}>
                                            {item.customDesc}
                                        </p>
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })
            )}
        </ul>
    );
};
