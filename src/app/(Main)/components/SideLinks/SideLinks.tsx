import { motion } from 'framer-motion';

import { useResizeWidth } from 'hooks/useResizeWidth';
import { sidebarData } from 'app/(Main)/components/SideLinks/sidebarData';
import { SidebarLink } from 'app/(Main)/components/SideLinks/SidebarLink/SidebarLink';

import scss from './SideLinks.module.scss';

interface SideLinksProps {
    open: boolean;
    setOpen?: (value: boolean) => void;
}

export const SideLinks = ({ open, setOpen }: SideLinksProps) => {
    const { pcBreak } = useResizeWidth();

    const width = open ? (pcBreak ? '200px' : '240px') : 'max-content';

    return (
        <div className={scss.menu_bar}>
            <motion.ul
                onHoverStart={() => (setOpen ? setOpen(true) : '')}
                onHoverEnd={() => (setOpen ? setOpen(false) : '')}
                initial={{ width: 'max-content' }}
                animate={{ width }}
            >
                {sidebarData.map((item) => (
                    <SidebarLink open={open} key={item.title} {...item} />
                ))}
            </motion.ul>
        </div>
    );
};
