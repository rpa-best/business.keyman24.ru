'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import DeleteSvg from '/public/svg/delete.svg';
import EditSvg from '/public/svg/edit.svg';
import { ColumnRowProps } from 'components/Table/types';

import scss from 'components/Table/Table.module.scss';

export const Row: React.FC<ColumnRowProps> = ({
    item,
    headers,
    handleEditClick,
    handleDeleteClick,
}) => {
    const [textArr, setTextArr] = useState<string[]>([]);

    const handleClick = (e: MouseEvent, func: (id: number) => void) => {
        e.stopPropagation();
        func(item.id);
    };

    const tableTdClassName = clsx({
        [scss.table_td]: true,
        [scss.table_td_less_3]: headers.length < 3,
    });

    const needActions = !!(handleEditClick || handleDeleteClick);

    useEffect(() => {
        const uniqueValues: string[] = [];
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            uniqueValues[i] = item[header.field] as string;
        }

        setTextArr(uniqueValues);
    }, [headers, item]);

    return textArr.map((el, index) => {
        const lastElem = textArr.length - 1 === index;
        return (
            <div className={tableTdClassName} key={index}>
                <p>{el}</p>
                {lastElem && needActions && (
                    <div className={scss.actions_wrapper}>
                        {handleEditClick && (
                            <EditSvg
                                onClick={(e: MouseEvent) =>
                                    handleClick(e, handleEditClick)
                                }
                                className={scss.svg}
                            />
                        )}
                        {handleDeleteClick && (
                            <DeleteSvg
                                onClick={(e: MouseEvent) =>
                                    handleClick(e, handleDeleteClick)
                                }
                                className={scss.svg}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    });
};
