export interface IHeadCheck {
    href: string;
    head: string;
}

export const headCheckData: IHeadCheck[] = [
    {
        href: '/locations',
        head: 'location/',
    },

    {
        href: `/inventory`,
        head: 'inventory/',
    },
    {
        href: `/permission-group`,
        head: 'permission/group/',
    },
    {
        href: '/workers',
        head: 'worker/',
    },
    {
        href: `/working-areas`,
        head: 'working_area/',
    },
];
