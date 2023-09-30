'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Escape from '/public/svg/x.svg';
import BurgerMenuSvg from 'app/(Main)/components/Header/components/svg/menu.svg';
import { IOrganization } from 'store/types';
import { SideLinks } from 'app/(Main)/components/SideLinks';
import { Organization } from 'app/(Main)/components/Header/components/Organization';

import scss from './BurgerMenu.module.scss';

interface BurgerMenuProps {
    organizations: IOrganization[];
    disabled: boolean;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
    organizations,
    disabled,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <BurgerMenuSvg
                onClick={() => setVisible(!visible)}
                style={{ cursor: 'pointer' }}
            />
            {visible && (
                <div
                    onClick={() => {
                        setVisible(!visible);
                    }}
                    className={scss.menu_outer}
                >
                    <motion.nav
                        onClick={(e) => e.stopPropagation()}
                        initial={{ x: '200%' }}
                        animate={{
                            translateX: '-200%',
                        }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                        className={scss.menu}
                    >
                        <div className={scss.organization_wrapper}>
                            <h2 className={scss.menu_listItem_header}>
                                Организация
                            </h2>
                            <div className={scss.menu_item_content}>
                                <Organization
                                    disabled={disabled}
                                    organizations={organizations}
                                />
                            </div>
                        </div>
                        <div>
                            <SideLinks open={true} />
                        </div>
                        <Escape
                            onClick={() => setVisible(!visible)}
                            className={scss.menu_exit}
                        />
                    </motion.nav>
                </div>
            )}
        </>
    );
};
