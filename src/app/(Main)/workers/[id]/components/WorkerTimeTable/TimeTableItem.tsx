'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import { IPlanObj } from 'http/types';

import scss from 'app/(Main)/workers/[id]/components/WorkerTimeTable/WorkerTimeTable.module.scss';

interface TimeTableItemProps {
    common: (string | number | undefined)[];
    more: IPlanObj;
}

export const TimeTableItem: React.FC<TimeTableItemProps> = ({
    common,
    more,
}) => {
    const [visible, setVisible] = useState(false);

    const tableRowWrapperClass = clsx({
        [scss.table_row_wrapper]: !visible,
        [scss.table_row_wrapper_open]: visible,
    });

    return (
        <div
            onClick={() => setVisible(!visible)}
            className={tableRowWrapperClass}
        >
            <div className={scss.table_row}>
                {common.map((el, i) => (
                    <div key={i} className={scss.table_body_item}>
                        {el}
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                        animate={{
                            height: 'max-content',
                            opacity: 1,
                        }}
                        className={scss.more_container}
                    >
                        <p className={scss.more_title}>История</p>
                        <div className={scss.more_wrapper}>
                            <div className={scss.more}>
                                <p>Входы</p>
                                {more.in.map((i, moreIndex) => (
                                    <p
                                        className={scss.more_item}
                                        onClick={(e) => e.stopPropagation()}
                                        key={moreIndex}
                                    >
                                        {i.slice(11, 16)}
                                    </p>
                                ))}
                            </div>
                            <div className={scss.more}>
                                <p>Выходы</p>
                                {more.out.map((i, moreIndex) => (
                                    <p
                                        className={scss.more_item}
                                        onClick={(e) => e.stopPropagation()}
                                        key={moreIndex}
                                    >
                                        {i.slice(11, 16)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
