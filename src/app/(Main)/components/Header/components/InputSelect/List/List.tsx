import React from 'react';

import { motion, MotionValue } from 'framer-motion';
import { ListProps } from 'components/UI/Inputs/types';

import scss from './List.module.scss';

export const SelectList: React.FC<ListProps> = ({
    list,
    handleSetData,
    opacity,
}) => {
    const handleClick = (id: number, name: string) => {
        handleSetData(id, name);
    };

    return (
        <motion.ul
            style={{ opacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={scss.list_wrapper}
        >
            {list?.map((item) => (
                <li
                    className={scss.list_item}
                    onClick={() => handleClick(item.id, item.name)}
                    key={item.id}
                >
                    {item.name}
                </li>
            ))}
        </motion.ul>
    );
};
