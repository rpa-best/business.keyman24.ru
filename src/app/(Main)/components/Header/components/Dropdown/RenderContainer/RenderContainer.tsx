import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, MotionValue } from 'framer-motion';

import UserSvg from '/public/svg/fi-rr-user.svg';
import LogoutSvg from 'app/(Main)/components/Header/components/svg/logout.svg';
import Cookies from 'universal-cookie';

import scss from './RenderContainer.module.scss';

interface RenderContainerProps {
    opacity: MotionValue<string>;
    setUserLogout: () => void;
}

const cookie = new Cookies();

export const RenderContainer: React.FC<RenderContainerProps> = ({
    opacity,
    setUserLogout,
}) => {
    const router = useRouter();

    const handleLogoutClick = () => {
        cookie.remove('access');
        cookie.remove('refresh');
        cookie.remove('orgId');
        setUserLogout();
        router.replace('/login');
    };

    return (
        <motion.ul style={{ opacity }} className={scss.dropdown_menu}>
            <li className={scss.dropdown_item}>
                <button className={scss.dropdown_button}>
                    <UserSvg className={scss.dropdown_svg} />
                    Профиль
                </button>
            </li>
            <li className={scss.dropdown_item}>
                <button
                    className={scss.dropdown_button}
                    onClick={handleLogoutClick}
                >
                    <LogoutSvg className={scss.dropdown_svg} />
                    Выйти
                </button>
            </li>
        </motion.ul>
    );
};
