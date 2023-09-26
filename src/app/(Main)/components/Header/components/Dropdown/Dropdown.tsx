'use client';

import Image from 'next/image';
import { useUserStore } from 'store/userStore';
import { useSpring } from 'framer-motion';

import ArrowSvg from '/public/svg/arrow.svg';
import AvatarSvg from '/public/svg/avatar.svg';
import { RenderContainer } from 'app/(Main)/components/Header/components/Dropdown/RenderContainer';
import { onHide, onMount } from 'utils/TippyHelper';
import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { IUser } from 'store/types';

import scss from './Dropdown.module.scss';

export const HeaderDropdown = ({ userData }: { userData: IUser }) => {
    const [currentUser, setCurrentUser] = useState(userData);
    const [visible, setVisible] = useState(false);
    const opacity = useSpring(0);

    const [user, setUserLogout, setUser] = useUserStore((state) => [
        state.user,
        state.setLogoutUser,
        state.setUser,
    ]);

    useEffect(() => {
        setUser(userData);
        setCurrentUser(user as IUser);
    }, [setUser, user, userData]);

    return (
        <Tippy
            onMount={() => onMount(opacity)}
            onHide={({ unmount }) => onHide({ opacity, unmount })}
            animation={true}
            visible={visible}
            interactive={true}
            placement="bottom"
            onClickOutside={() => {
                setVisible(!visible);
            }}
            render={() => (
                <RenderContainer
                    opacity={opacity}
                    setUserLogout={setUserLogout}
                />
            )}
        >
            <div
                onClick={() => {
                    opacity.set(0);
                    setVisible(!visible);
                }}
                className={scss.user_wrapper}
            >
                <div className={scss.user_avatar_wrapper}>
                    {user?.avatar ? (
                        <Image
                            src={currentUser?.avatar}
                            fill
                            alt="user-image"
                        />
                    ) : (
                        <AvatarSvg style={{ color: '#2D2D2D' }} />
                    )}
                </div>
                <div className={scss.user}>
                    <p className={scss.user_name}>
                        {currentUser.name && currentUser.surname
                            ? `${currentUser?.name} ${currentUser?.surname}`
                            : 'Пользователь'}
                    </p>
                    <p className={scss.user_role}>{currentUser?.username}</p>
                </div>
                <ArrowSvg
                    className={visible ? scss.arrow : scss.arrow_hidden}
                />
            </div>
        </Tippy>
    );
};
