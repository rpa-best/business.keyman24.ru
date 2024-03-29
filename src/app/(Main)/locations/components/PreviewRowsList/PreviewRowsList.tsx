import React from 'react';

import { PreviewRowsListProps } from 'app/(Main)/locations/types';
import { PreviewListItem } from 'app/(Main)/locations/components/PreviewRowsList/PreviewListItem';

import scss from './PreviewRowsList.module.scss';

export const PreviewRowsList: React.FC<PreviewRowsListProps> = ({
    deleteOne,
    data,
}) => {
    if (data.length === 0) {
        return <div className={scss.empty}>Здесь будет ваш инвентарь</div>;
    }
    return (
        <div className={scss.preview_wrapper}>
            <div className={scss.scrollbar_layout}>
                {data?.map((item, index) => (
                    <PreviewListItem
                        key={index}
                        {...item}
                        deleteOne={deleteOne}
                    />
                ))}
            </div>
        </div>
    );
};
