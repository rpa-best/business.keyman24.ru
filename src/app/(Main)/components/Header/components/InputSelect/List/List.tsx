import React from 'react';

import { motion, MotionValue } from 'framer-motion';

import scss from './List.module.scss';

interface ListProps {
    list: { id: number; name: string }[];
    handleSetData: (id: number, name: string) => void;
    opacity: MotionValue<string>;
}

export const List: React.FC<ListProps> = ({ list, handleSetData, opacity }) => {
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
