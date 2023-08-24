'use client';

import { useState } from 'react';

import { SideLinks } from 'app/(Main)/components/SideLinks';

import scss from './Menu.module.scss';

export function SideMenu() {
    const [open, setOpen] = useState(false);
    return (
        <aside className={scss.sidebar_wrapper}>
            <nav className={scss.sidebar}>
                <SideLinks open={open} setOpen={setOpen} />
            </nav>
        </aside>
    );
}
