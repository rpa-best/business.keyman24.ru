'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { useSpring } from 'framer-motion';

import { onHide, onMount } from 'utils/TippyHelper';
import Arrow from '/public/svg/arrow.svg';
import { useOrganizationStore } from 'store/organizationStore';
import { IOrganization } from 'store/types';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';

import scss from './InputSelect.module.scss';
import { SelectList } from 'app/(Main)/components/Header/components/InputSelect/List';
import clsx from 'clsx';

const cookie = new Cookies();

export const HeaderInputSelect: React.FC<{
    organizations: IOrganization[];
}> = ({ organizations }) => {
    const router = useRouter();

    const opacity = useSpring(0);

    //Все оганизации пользователя
    const [listValues, setListValues] = useState(
        organizations?.map((org) => {
            return {
                id: org.id,
                name: org.name,
            };
        })
    );

    const [visible, setVisible] = useState(false);
    //Её id и наименование
    const [id, setId] = useState<number>(
        cookie.get('orgId') ?? listValues[0].id
    );
    const [name, setName] = useState<string>(listValues[0].name);
    const [setOrganization] = useOrganizationStore((state) => [
        state.setOrganization,
    ]);

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
        setId(id);
        cookie.set('orgId', id);
        setVisible(!visible);
        router.refresh();
    };

    const onClickOutside = () => {
        setVisible(false);
        setName(listValues?.find((v) => v.id === id)?.name as string);
    };

    return (
        <div className={scss.input_layout}>
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
