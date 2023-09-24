'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { IWorkerPlan } from 'http/types';

import scss from './WorkerTimeTable.module.scss';
import { TimeTableItem } from 'app/(Main)/workers/[id]/components/WorkerTimeTable/TimeTableItem';

interface WorkerTimeTableProps {
    data: IWorkerPlan;
}

export const WorkerTimeTable: React.FC<WorkerTimeTableProps> = ({ data }) => {
    const test = Object.entries(data.plan).filter((item) => {
        return item[1].in.length !== 0;
    });

    const headerRef = useRef<HTMLDivElement>(null);

    const rowData = test.map((i) => {
        const data = `${i[0].slice(8)}.${i[0].slice(5, 7)}.${i[0].slice(0, 4)}`;
        const actions = i[1];
        const actionIn = actions.in.at(-1)?.slice(11, 16);
        const actionOut = actions.out[0].slice(11, 16);
        return {
            common: [data, actionIn, actionOut, actions.workedTime],
            more: i[1],
        };
    });

    const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
        headerRef.current
            ? (headerRef.current.scrollLeft = e.currentTarget.scrollLeft)
            : undefined;
    };

    return (
        <div className={scss.time_table}>
            <div ref={headerRef} className={scss.time_table_head}>
                <div className={scss.table_head_item}>Дата</div>
                <div className={scss.table_head_item}>Время прихода</div>
                <div className={scss.table_head_item}>Время ухода</div>
                <div className={scss.table_head_item}>Отработано</div>
            </div>
            <motion.div
                onScroll={handleBodyScroll}
                className={scss.time_table_body}
            >
                {rowData.map((item, index) => (
                    <TimeTableItem key={index} {...item} />
                ))}
            </motion.div>
        </div>
    );
};
