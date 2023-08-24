import React from 'react';

import scss from './MainPageCard.module.scss';

interface MainPageCard {
    title: string;
    current: number;
    total: number;
    Icon: React.ElementType;
}

export const MainPageCard: React.FC<MainPageCard> = ({
    Icon,
    title,
    total,
    current,
}) => {
    return (
        <div className={scss.card_layout}>
            <div className={scss.card_wrapper}>
                <div className={scss.description_wrapper}>
                    <p className={scss.card_title}>{title}</p>
                    <p
                        className={scss.card_number}
                    >{`${current} / ${total}`}</p>
                </div>
                <Icon className={scss.card_ico} />
            </div>
        </div>
    );
};
