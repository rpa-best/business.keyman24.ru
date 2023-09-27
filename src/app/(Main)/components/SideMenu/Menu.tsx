'use client';

import React, { useState } from 'react';

import { SideLinks } from 'app/(Main)/components/SideLinks';

import scss from './Menu.module.scss';

interface SideMenuProps {
    disabled: boolean;
    headCheck: (string | void)[];
}

export const SideMenu: React.FC<SideMenuProps> = ({ disabled, headCheck }) => {
    const [open, setOpen] = useState(false);

    return (
        <aside
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            className={scss.sidebar_wrapper}
        >
            <nav className={scss.sidebar}>
                <SideLinks
                    headCheck={headCheck}
                    open={open}
                    setOpen={setOpen}
                />
            </nav>
        </aside>
    );
};
