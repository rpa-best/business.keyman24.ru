'use client';

import { MainPageCard } from 'app/(Main)/components/MainCards/MainPageCard';
import { cardsData } from 'app/(Main)/components/MainCards/data';

export const MainCards = () => {
    return (
        <>
            {cardsData.map((cardData, item) => (
                <MainPageCard {...cardData} key={item} />
            ))}
        </>
    );
};
