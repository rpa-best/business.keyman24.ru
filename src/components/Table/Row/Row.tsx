'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import DeleteSvg from '/public/svg/delete.svg';
import EditSvg from '/public/svg/edit.svg';
import { ColumnRowProps } from 'components/Table/types';

import scss from 'components/Table/Table.module.scss';
import { useResizeWidth } from 'hooks/useResizeWidth';

export const Row: React.FC<ColumnRowProps> = ({
    item,
    headers,
    handleEditClick,
    handleDeleteClick,
    setTableData,
    stopPropagation,
}) => {
    const [textArr, setTextArr] = useState<string[]>([]);

    const handleClick = (e: MouseEvent, func: (id: number) => void) => {
        e.stopPropagation();
        func(item.id);
    };

    const onDeleteClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (handleDeleteClick) {
            handleDeleteClick(item.id).then((r) => {
                setTableData((d) => d.filter((el) => el.id !== item.id));
            });
        }
    };

    const textClass = clsx({
        [scss.text_class]: stopPropagation,
    });

    const tableTdClassName = clsx({
        [scss.table_td]: true,
        [scss.table_td_less_3]: headers.length < 3,
        [scss.table_td_more_3]: headers.length > 3,
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
            <React.Fragment key={index}>
                <div
                    style={lastElem ? { position: 'relative' } : undefined}
                    className={tableTdClassName}
                >
                    <p
                        className={textClass}
                        onClick={
                            stopPropagation
                                ? (event) => event.stopPropagation()
                                : undefined
                        }
                    >
                        {el}
                    </p>
                    {lastElem && needActions && (
                        <div className={scss.actions_wrapper}>
                            {handleEditClick && (
                                <EditSvg
                                    onClick={(e: MouseEvent) =>
                                        handleClick(e, handleEditClick)
                                    }
                                    className={scss.custom_svg}
                                />
                            )}
                            {handleDeleteClick && (
                                <DeleteSvg
                                    onClick={onDeleteClick}
                                    className={
                                        handleEditClick
                                            ? scss.custom_svg
                                            : scss.custom_svg_without_edit
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    });
};
