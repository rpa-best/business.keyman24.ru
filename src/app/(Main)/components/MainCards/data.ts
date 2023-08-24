import { ElementType } from 'react';

import KeySvg from '/public/svg/key.svg';
import EmployeeSvg from './svg/Employees.svg';
import CaseSvg from '/public/svg/briefcase.svg';

export type CardType = {
    title: string;
    current: number;
    total: number;
    Icon: ElementType;
};

export type CardsType = CardType[];

export const cardsData: CardsType = [
    {
        title: 'Ключи',
        current: 3,
        total: 40,
        Icon: KeySvg,
    },
    {
        title: 'Мат. ценности',
        current: 2,
        total: 20,
        Icon: CaseSvg,
    },
    {
        title: 'Сотрудники',
        current: 6,
        total: 30,
        Icon: EmployeeSvg,
    },
];
