import React, { useState } from 'react';
import clsx from 'clsx';

import { ColumnHeaderProps } from 'components/Table/types';
import ArrowSvg from '/public/svg/arrow.svg';

import scss from 'components/Table/Table.module.scss';
import { Button } from 'components/UI/Buttons/Button';

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
    sortable,
    name,
    sortTableData,
    lastChild,
    headersCount,
    field,
    sortedField,
    buttonData,
    stopPropagation,
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
        [scss.table_headers_more_3]: headersCount > 3,
    });

    const textClass = clsx({
        [scss.text_class]: stopPropagation,
    });

    const arrowClassname = clsx({
        [scss.table_td_header_arrow]: !bounce && !currentField,
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
            <div className={scss.header_name_wrapper}>
                <p className={textClass}>{name}</p>
                {sortable && <ArrowSvg className={arrowClassname} />}
            </div>
            {lastChild && buttonData?.text && (
                <div className={scss.headers_button_wrapper}>
                    <Button
                        nowrap={true}
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
