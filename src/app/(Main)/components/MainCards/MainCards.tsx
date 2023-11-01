'use client';

import React, { useMemo } from 'react';

import {
    CardsType,
    MainCardsProps,
} from 'app/(Main)/components/MainCards/types';
import { MainPageCard } from 'app/(Main)/components/MainCards/MainPageCard';
import KeySvg from '/public/svg/key.svg';
import EmployeeSvg from '/public/svg/Employees.svg';
import CaseSvg from '/public/svg/briefcase.svg';

export const MainCards: React.FC<MainCardsProps> = ({ statistics }) => {
    const cardsData: CardsType = useMemo(() => {
        return [
            {
                title: 'Ключи',
                current: statistics.keyTaken,
                total: statistics.keyCount,
                Icon: KeySvg,
            },
            {
                title: 'Мат. ценности',
                current: statistics.inventoryTaken,
                total: statistics.inventoryCount,
                Icon: CaseSvg,
            },
            {
                title: 'Сотрудники',
                current: statistics.workerTaken,
                total: statistics.workerCount,
                Icon: EmployeeSvg,
            },
        ];
    }, [
        statistics.inventoryCount,
        statistics.inventoryTaken,
        statistics.keyCount,
        statistics.keyTaken,
        statistics.workerCount,
        statistics.workerTaken,
    ]);

    return (
        <>
            {cardsData.map((cardData, item) => (
                <MainPageCard {...cardData} key={item} />
            ))}
        </>
    );
};
