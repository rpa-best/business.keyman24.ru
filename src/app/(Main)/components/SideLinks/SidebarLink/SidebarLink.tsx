import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarLinkProps } from 'app/(Main)/components/SideLinks/sidebarData';
import { motion } from 'framer-motion';
import { useAllowedPath } from 'hooks/useDeniedPath';

import scss from './SidebarLink.module.scss';
import React, { useEffect, useState } from 'react';

interface ISidebarLinkProps extends SidebarLinkProps {
    open: boolean;
    setVisible?: (value: boolean) => void;
    size: 'pc' | 'tablet';
}

export const SidebarLink = ({
    Icon,
    title,
    href,
    open,
    size,
    head,
    setVisible,
}: ISidebarLinkProps) => {
    const pathname = usePathname();

    const pathString = pathname.replace(/^\/|\/(?=.*\/)/g, '');
    const hrefString = href.replace(/^\/|\/(?=.*\/)/g, '');

    const path = useAllowedPath(head as string, size);

    if (!path) {
        return null;
    }

    const currentPage =
        pathString === hrefString
            ? true
            : pathString.startsWith(hrefString) && href !== '/';

    return (
        <li
            className={
                currentPage ? scss.link_wrapper_active : scss.link_wrapper
            }
        >
            <Link
                className={currentPage ? scss.link_active : scss.link}
                href={href}
                onClick={() => (setVisible ? setVisible(false) : '')}
            >
                <Icon
                    className={
                        currentPage ? scss.link_icon_active : scss.link_icon
                    }
                />
                {open && (
                    <motion.p
                        className={scss.link_description}
                        initial={{ display: 'none' }}
                        animate={{ display: 'inline' }}
                    >
                        {title}
                    </motion.p>
                )}
            </Link>
        </li>
    );
};
