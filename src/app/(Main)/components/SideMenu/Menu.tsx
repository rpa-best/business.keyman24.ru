'use client';

import { useState } from 'react';

import { SideLinks } from 'app/(Main)/components/SideLinks';

import scss from './Menu.module.scss';

export function SideMenu({ disabled }: { disabled: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <aside
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            className={scss.sidebar_wrapper}
        >
            <nav className={scss.sidebar}>
                <SideLinks open={open} setOpen={setOpen} />
            </nav>
        </aside>
    );
}
