import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarLinkProps } from 'app/(Main)/components/SideLinks/sidebarData';
import { motion } from 'framer-motion';

import scss from './SidebarLink.module.scss';

interface ISidebarLinkProps extends SidebarLinkProps {
    open: boolean;
}

export const SidebarLink = ({ Icon, title, href, open }: ISidebarLinkProps) => {
    const pathname = usePathname();

    const currentPage = pathname.endsWith(href);

    return (
        <li
            className={
                currentPage ? scss.link_wrapper_active : scss.link_wrapper
            }
        >
            <Link
                className={currentPage ? scss.link_active : scss.link}
                href={href}
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
