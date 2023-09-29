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
import { IServiceRate } from 'http/types';

import scss from './Dropdown.module.scss';
import { useConstructorStore } from 'store/useConstructorStore';

interface HeaderDropdownProps {
    userData: IUser;
    subs: IServiceRate[];
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
    userData,
    subs,
}) => {
    const [visible, setVisible] = useState(false);
    const opacity = useSpring(0);

    const [user, setUserLogout, setUser] = useUserStore((state) => [
        state.user,
        state.setLogoutUser,
        state.setUser,
    ]);

    const [setFields] = useConstructorStore((state) => [state.setFields]);

    useEffect(() => {
        setUser(userData);
    }, [userData]);

    useEffect(() => {
        setFields(
            subs?.map((item) => ({
                id: item.id,
                name: item.key.name,
                count: item.value.toString(),
                max: item.key.maxValue.toString(),
                slug: item.key.modelName,
                notLimited: item.notLimited,
                min: '0',
                costNotLimited: item.key.costNotLimited,
                cost: item.key.cost,
            }))
        );
    }, [subs]);

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
                        <Image src={user?.avatar} fill alt="user-image" />
                    ) : (
                        <AvatarSvg style={{ color: '#2D2D2D' }} />
                    )}
                </div>
                <div className={scss.user}>
                    <p className={scss.user_name}>
                        {user?.name && user?.surname
                            ? `${user?.name} ${user?.surname}`
                            : 'Пользователь'}
                    </p>
                    <p className={scss.user_role}>{user?.username}</p>
                </div>
                <ArrowSvg
                    className={visible ? scss.arrow : scss.arrow_hidden}
                />
            </div>
        </Tippy>
    );
};
