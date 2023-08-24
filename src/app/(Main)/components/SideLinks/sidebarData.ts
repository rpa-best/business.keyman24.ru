import KeySvg from '/public/svg/key.svg';
import GlobeSvg from './svg/globe.svg';
import HomeSvg from './svg/home.svg';
import BriefCaseSvg from '/public/svg/briefcase.svg';
import UserLockSvg from './svg/user-lock.svg';
import WorkerSvg from '/public/svg/user.svg';
import ComputerSvg from './svg/computer.svg';
import { ElementType } from 'react';

export interface SidebarLinkProps {
    title: string;
    Icon: ElementType;
    href: string;
}

export const sidebarData: SidebarLinkProps[] = [
    {
        title: 'Главная',
        href: '/',
        Icon: HomeSvg,
    },
    {
        title: 'Локация',
        href: '/location',
        Icon: GlobeSvg,
    },

    {
        title: 'Инвентарь',
        href: `/inventory`,
        Icon: BriefCaseSvg,
    },
    {
        title: 'Ключи',
        href: '/keys',
        Icon: KeySvg,
    },
    {
        title: 'Права доступа',
        href: `/permission-group`,
        Icon: UserLockSvg,
    },
    {
        title: 'Работники',
        href: '/worker',
        Icon: WorkerSvg,
    },
    {
        title: 'Рабочее место',
        href: `/working-area`,
        Icon: ComputerSvg,
    },
];
