import React, { ChangeEvent, useState } from 'react';

import EditSvg from '/public/svg/edit.svg';
import DeleteSvg from '/public/svg/delete.svg';
import CompleteSvg from '/public/svg/done.svg';
import { Input } from 'UI/Inputs/Input';
import { PreviewListItemProps } from 'app/(Main)/keys/types';

import scss from 'app/(Main)/keys/components/PreviewRowsList/PreviewRowsList.module.scss';

export const PreviewListItem: React.FC<PreviewListItemProps> = ({
    id,
    category,
    data,
    handleChange,
    count,
    deleteOne,
}) => {
    const [editable, setEditable] = useState(false);

    const handleCompleteClick = () => {
        localStorage.setItem('data', JSON.stringify(data));
        setEditable(false);
    };

    return (
        <>
            <div className={scss.preview_item}>
                <div
                    style={!editable ? { pointerEvents: 'none' } : undefined}
                    className={scss.preview_item_count}
                >
                    <Input
                        needErrorLabel={false}
                        value={count.toString()}
                        name="count"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(id, 'count', e.target.value)
                        }
                    />
                </div>
                <div
                    style={!editable ? { pointerEvents: 'none' } : undefined}
                    className={scss.preview_item_category}
                >
                    <Input
                        needErrorLabel={false}
                        value={category}
                        name="category"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleChange(id, 'category', e.target.value)
                        }
                    />
                </div>
                {!editable && (
                    <EditSvg
                        style={editable ? { color: '#31D79B' } : undefined}
                        onClick={() => setEditable(true)}
                        className={scss.svg}
                    />
                )}
                {editable && (
                    <CompleteSvg
                        onClick={() => handleCompleteClick()}
                        className={scss.svg}
                    />
                )}
                <DeleteSvg onClick={() => deleteOne(id)} className={scss.svg} />
            </div>
        </>
    );
};
