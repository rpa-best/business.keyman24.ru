'use client';

import React, { ChangeEvent, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { useSpring } from 'framer-motion';

import { onHide, onMount } from 'utils/TippyHelper';
import Arrow from '/public/svg/arrow.svg';
import { useOrganizationStore } from 'store/organizationStore';
import { IOrganization } from 'store/types';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { SelectList } from 'app/(Main)/components/Header/components/InputSelect/List';
import clsx from 'clsx';

import scss from './InputSelect.module.scss';

const cookie = new Cookies();

export const HeaderInputSelect: React.FC<{
    organizations: IOrganization[];
    disabled?: boolean;
}> = ({ organizations, disabled = false }) => {
    const router = useRouter();
    //Все оганизации пользователя
    const [listValues, setListValues] = useState(
        organizations?.map((org) => {
            return {
                id: org.id,
                name: org.name,
            };
        })
    );
    const [name, setName] = useState<string>(listValues[0]?.name);
    const [setOrganization] = useOrganizationStore((state) => [
        state.setOrganization,
    ]);
    const [organization] = useOrganizationStore((state) => [
        state.organization,
    ]);

    const opacity = useSpring(0);
    const [visible, setVisible] = useState(false);

    const arrowClassname = clsx({
        [scss.input_arrow_svg]: true,
        [scss.input_arrow_svg_open]: visible,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setListValues(
            organizations?.filter((item) => {
                if (
                    item.name
                        .toLowerCase()
                        .startsWith(e.target.value.toLowerCase())
                ) {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                }
            })
        );
    };

    const handleSetData = (id: number, name: string) => {
        setOrganization(
            organizations?.find((org) => org.id === id) as IOrganization
        );
        setName(name);
        cookie.set('orgId', id);
        setVisible(!visible);
        router.refresh();
    };

    const onClickOutside = () => {
        setVisible(false);
        setName(
            listValues?.find((v) => v.id === organization?.id)?.name as string
        );
    };

    if (organizations.length === 0) {
        return null;
    }

    return (
        <div
            style={{ pointerEvents: disabled ? 'none' : 'auto' }}
            className={scss.input_layout}
        >
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                interactive={true}
                visible={visible}
                placement="bottom"
                onClickOutside={onClickOutside}
                render={(attrs) => (
                    <SelectList
                        {...attrs}
                        opacity={opacity}
                        handleSetData={handleSetData}
                        list={listValues}
                    />
                )}
            >
                <div
                    onClick={() => {
                        setVisible(!visible);
                        opacity.set(0);
                    }}
                    className={scss.input_wrapper}
                >
                    <input
                        className={scss.input}
                        value={name}
                        onChange={handleChange}
                    />
                    <Arrow className={arrowClassname} />
                </div>
            </Tippy>
        </div>
    );
};
