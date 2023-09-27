'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Escape from '/public/svg/x.svg';
import BurgerMenuSvg from 'app/(Main)/components/Header/components/svg/menu.svg';
import { IOrganization } from 'store/types';
import { SettingsSvgContainer } from 'app/(Main)/components/Header/components/ClientComponentsWithSvg/Settings';
import { HeaderInputSelect } from 'app/(Main)/components/Header/components/InputSelect';
import { SideLinks } from 'app/(Main)/components/SideLinks';

import scss from './BurgerMenu.module.scss';

interface BurgerMenuProps {
    organizations: IOrganization[];
    headCheck: (string | void)[];
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({
    organizations,
    headCheck,
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
                                <SettingsSvgContainer />
                                <HeaderInputSelect
                                    organizations={
                                        organizations as IOrganization[]
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <SideLinks headCheck={headCheck} open={true} />
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
