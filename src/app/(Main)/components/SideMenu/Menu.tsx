'use client';

import React, { useState } from 'react';

import { SideLinks } from 'app/(Main)/components/SideLinks';

import scss from './Menu.module.scss';
import { useResizeWidth } from 'hooks/useResizeWidth';

interface SideMenuProps {
    disabled: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ disabled }) => {
    const [open, setOpen] = useState(false);
    const { tabletBreak } = useResizeWidth();

    if (tabletBreak) {
        return null;
    }

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
};
