'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { useSpring } from 'framer-motion';

import { onHide, onMount } from 'utils/TippyHelper';
import Arrow from '/public/svg/arrow.svg';
import { useOrganizationStore } from 'store/organizationStore';
import { IOrganization } from 'store/types';
import { List } from './List';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';

import scss from './InputSelect.module.scss';

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
    const [id, setId] = useState<number>(cookie.get('orgId') ?? 1);
    const [name, setName] = useState(
        listValues?.find((v) => v.id === id)?.name
    );
    const [setOrganization] = useOrganizationStore((state) => [
        state.setOrganization,
    ]);

    const currentId = useRef(id);

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
        currentId.current = id;
        cookie.set('orgId', id);
        setVisible(!visible);
        router.refresh();
    };

    const onClickOutside = () => {
        setVisible(!visible);
        setId(currentId.current);
        setName(listValues?.find((v) => v.id === currentId.current)?.name);
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
                    <List
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
                    <div className={scss.input_arrow_wrapper}>
                        <Arrow
                            className={
                                visible
                                    ? scss.input_arrow_open
                                    : scss.input_arrow
                            }
                        />
                    </div>
                </div>
            </Tippy>
        </div>
    );
};
