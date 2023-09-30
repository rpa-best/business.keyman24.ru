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
    head?: string;
}

export const sidebarData: SidebarLinkProps[] = [
    {
        title: 'Главная',
        href: '/',
        Icon: HomeSvg,
    },
    {
        title: 'Локация',
        href: '/locations',
        Icon: GlobeSvg,
        head: 'location/',
    },

    {
        title: 'Инвентарь',
        href: `/inventory`,
        Icon: BriefCaseSvg,
        head: 'inventory/',
    },
    {
        title: 'Права доступа',
        href: `/permission-group`,
        Icon: UserLockSvg,
        head: 'permission/group/',
    },
    {
        title: 'Работники',
        href: '/workers',
        Icon: WorkerSvg,
        head: 'worker/',
    },
    {
        title: 'Рабочее место',
        href: `/working-areas`,
        Icon: ComputerSvg,
        head: 'working_area/',
    },
];
