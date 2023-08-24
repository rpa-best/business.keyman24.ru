import React, { ChangeEvent } from 'react';

import { PreviewListItem } from 'app/(Main)/keys/components/PreviewRowsList/PreviewListItem';
import { PreviewRowsListProps } from 'app/(Main)/keys/types';

import scss from './PreviewRowsList.module.scss';

export const PreviewRowsList: React.FC<PreviewRowsListProps> = ({
    deleteOne,
    deleteAll,
    handleChange,
    data,
}) => {
    if (data.length === 0) {
        return <div className={scss.empty}>Здесь будут ваши ключи</div>;
    }
    return (
        <div className={scss.preview_wrapper}>
            <div className={scss.scrollbar_layout}>
                {data?.map((item, index) => (
                    <PreviewListItem
                        key={index}
                        data={data}
                        {...item}
                        deleteOne={deleteOne}
                        handleChange={handleChange}
                    />
                ))}
            </div>
        </div>
    );
};
