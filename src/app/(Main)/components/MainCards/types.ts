import { ElementType } from 'react';

import { MainCardsData } from 'http/types';

export type CardType = {
    title: string;
    current: number;
    total: number;
    Icon: ElementType;
};

export type CardsType = CardType[];

export interface MainCardsProps {
    statistics: MainCardsData;
}
