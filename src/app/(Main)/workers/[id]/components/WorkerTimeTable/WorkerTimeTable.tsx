'use client';

import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

import { IWorkerPlan } from 'http/types';
import { TimeTableItem } from 'app/(Main)/workers/[id]/components/WorkerTimeTable/TimeTableItem';

import scss from './WorkerTimeTable.module.scss';

interface WorkerTimeTableProps {
    data: IWorkerPlan;
}

export const WorkerTimeTable: React.FC<WorkerTimeTableProps> = ({ data }) => {
    const headerRef = useRef<HTMLDivElement>(null);

    const test = useMemo(() => {
        return Object.entries(data?.plan).filter((item) => {
            return item[1].in.length !== 0;
        });
    }, [data?.plan]);

    const rowData = useMemo(() => {
        return test?.map((i) => {
            const data = `${i[0].slice(8)}.${i[0].slice(5, 7)}.${i[0].slice(
                0,
                4
            )}`;
            const actions = i[1];
            const actionIn = actions.in[0].slice(11, 16);
            const actionOut = actions?.out.at(-1)?.slice(11, 16);
            return {
                common: [data, actionIn, actionOut, actions.workedTime],
                more: i[1],
            };
        });
    }, [test]);

    if (!data) {
        return null;
    }

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
