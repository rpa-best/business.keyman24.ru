'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Escape from '/public/svg/x.svg';
import BurgerMenuSvg from 'app/(Main)/components/Header/components/svg/menu.svg';
import { IOrganization } from 'store/types';
import { SideLinks } from 'app/(Main)/components/SideLinks';
import { Organization } from 'app/(Main)/components/Header/components/Organization';
import Cookies from 'universal-cookie';

import scss from './BurgerMenu.module.scss';
import { sidebarData } from 'app/(Main)/components/SideLinks/sidebarData';
import { allowedPath } from 'http/userApi';

const cookie = new Cookies();

interface BurgerMenuProps {
    organizations: IOrganization[];
    disabled: boolean;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
    organizations,
    disabled,
}) => {
    const [visible, setVisible] = useState(false);

    const [allowedPaths, setAllowedPaths] = useState<string[]>([]);

    useEffect(() => {
        const orgId = cookie.get('orgId');
        sidebarData.forEach((el) => {
            if (el.head === '/') {
                setAllowedPaths((p) => [...p, '/']);
                return;
            }
            allowedPath(el.head as string, orgId)
                .then((d) => {
                    if (d) {
                        setAllowedPaths((paths) => [
                            ...paths,
                            el.head as string,
                        ]);
                    }
                })
                .catch((e) => e);
        });
    }, []);

    return (
        <>
            <BurgerMenuSvg
                onClick={() => setVisible(!visible)}
                style={{ cursor: 'pointer' }}
            />
            <AnimatePresence>
                {visible && (
                    <motion.div
                        onClick={() => {
                            setVisible(!visible);
                        }}
                        exit={{ background: 'transparent' }}
                        className={scss.menu_outer}
                    >
                        <motion.nav
                            onClick={(e) => e.stopPropagation()}
                            initial={{ x: '100%' }}
                            animate={{
                                translateX: '-100%',
                            }}
                            exit={{ translateX: '100%' }}
                            transition={{ ease: 'easeOut', duration: 0.2 }}
                            className={scss.menu}
                        >
                            <div className={scss.organization_wrapper}>
                                <h2 className={scss.menu_listItem_header}>
                                    Организация
                                </h2>
                                <div className={scss.menu_item_content}>
                                    <Organization
                                        size="tablet"
                                        allowedPaths={allowedPaths}
                                        disabled={disabled}
                                        organizations={organizations}
                                    />
                                </div>
                            </div>
                            <div>
                                <SideLinks
                                    allowedPaths={allowedPaths}
                                    size="tablet"
                                    open={true}
                                    setVisible={setVisible}
                                />
                            </div>
                            <Escape
                                onClick={() => setVisible(!visible)}
                                className={scss.menu_exit}
                            />
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
