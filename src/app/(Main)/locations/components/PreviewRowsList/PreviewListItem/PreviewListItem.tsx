import React from 'react';

import DeleteSvg from '/public/svg/delete.svg';
import { Input } from 'components/UI/Inputs/Input';
import { PreviewListItemProps } from 'app/(Main)/locations/types';

import scss from 'app/(Main)/locations/components/PreviewRowsList/PreviewRowsList.module.scss';

export const PreviewListItem: React.FC<PreviewListItemProps> = ({
    id,
    category,
    count,
    deleteOne,
}) => {
    return (
        <>
            <div className={scss.preview_item}>
                <div className={scss.preview_item_count}>
                    <Input
                        disabled
                        needErrorLabel={false}
                        value={count.toString()}
                        name="count"
                        onChange={() => {}}
                    />
                </div>
                <div className={scss.preview_item_category}>
                    <Input
                        disabled
                        needErrorLabel={false}
                        value={category}
                        name="category"
                        onChange={() => {}}
                    />
                </div>
                <DeleteSvg onClick={() => deleteOne(id)} className={scss.svg} />
            </div>
        </>
    );
};
