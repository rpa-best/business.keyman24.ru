import React, { useState } from 'react';
import clsx from 'clsx';

import { ColumnHeaderProps } from 'components/Table/types';
import ArrowSvg from '/public/svg/arrow.svg';

import scss from 'components/Table/Table.module.scss';
import { Button } from 'UI/Buttons/Button';

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
    sortable,
    name,
    sortTableData,
    lastChild,
    headersCount,
    field,
    sortedField,
    buttonData,
}) => {
    const [bounce, setBounce] = useState(false);
    const currentField = sortedField === field;

    const handleClick = (e: MouseEvent, func: () => void) => {
        e.stopPropagation();
        func();
    };

    const headerClassName = clsx({
        [scss.table_header]: true,
        [scss.table_header_less_3]: headersCount < 3,
    });

    const arrowClassname = clsx({
        [scss.table_td_header_arrow]: true,
        [scss.table_td_header_arrow_active]: bounce && currentField,
        [scss.table_td_header_arrow_active_desc]: !bounce && currentField,
    });

    return (
        <div
            onClick={
                sortable
                    ? () => {
                          sortTableData(field);
                          setBounce(!bounce);
                      }
                    : undefined
            }
            style={{ cursor: `${sortable ? 'pointer' : 'initial'}` }}
            className={headerClassName}
        >
            <div>
                {name}
                {sortable && <ArrowSvg className={arrowClassname} />}
            </div>
            {lastChild && buttonData?.text && (
                <div className={scss.headers_button_wrapper}>
                    <Button
                        onClick={
                            ((e: MouseEvent) =>
                                handleClick(e, buttonData?.onClick)) as any
                        }
                        type="button"
                    >
                        {buttonData?.text as string}
                    </Button>
                </div>
            )}
        </div>
    );
};
