import { motion } from 'framer-motion';

import React from 'react';
import { useResizeWidth } from 'hooks/useResizeWidth';
import { sidebarData } from 'app/(Main)/components/SideLinks/sidebarData';
import { SidebarLink } from 'app/(Main)/components/SideLinks/SidebarLink/SidebarLink';

import scss from './SideLinks.module.scss';

interface SideLinksProps {
    open: boolean;
    allowedPaths?: string[];
    size?: 'tablet' | 'pc';
    setOpen?: (value: boolean) => void;
    setVisible?: (value: boolean) => void;
}

export const SideLinks = ({
    open,
    setOpen,
    setVisible,
    size = 'pc',
    allowedPaths,
}: SideLinksProps) => {
    const { pcBreak } = useResizeWidth();

    const width = open ? (pcBreak ? '200px' : '240px') : 'max-content';

    return (
        <div
            style={size === 'tablet' ? { width: '100%' } : undefined}
            className={scss.menu_bar}
        >
            <motion.ul
                onHoverStart={() => (setOpen ? setOpen(true) : '')}
                onHoverEnd={() => (setOpen ? setOpen(false) : '')}
                initial={{ width: 'max-content' }}
                animate={{ width }}
            >
                {sidebarData.map((item) => {
                    if (item.head === 'service/subscription') {
                        return null;
                    }
                    if (
                        size === 'tablet' &&
                        !allowedPaths?.includes(item.head as string)
                    ) {
                        return null;
                    }
                    return (
                        <SidebarLink
                            size={size}
                            setVisible={setVisible}
                            open={open}
                            key={item.title}
                            {...item}
                        />
                    );
                })}
            </motion.ul>
        </div>
    );
};
