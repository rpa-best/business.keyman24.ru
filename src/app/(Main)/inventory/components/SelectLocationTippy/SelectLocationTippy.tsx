import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { onHide, onMount } from 'utils/TippyHelper';
import { useSpring } from 'framer-motion';
import { TippyContent } from 'app/(Main)/inventory/components/SelectLocationTippy/TippyContent';
import { IInventory } from 'http/types';
import { useSearchParams } from 'next/navigation';

import scss from './SelectLocationInput.module.scss';

export const SelectLocationTippy = ({
    inventory,
}: {
    inventory: IInventory[];
}) => {
    const searchParams = useSearchParams();
    const [visible, setVisible] = useState(false);
    const [count, setCount] = useState('');
    const opacity = useSpring(0);

    useEffect(() => {
        const location = searchParams.get('location');
        if (!location) {
            setCount('');
        }
    }, [searchParams]);

    return (
        <div style={{ zIndex: 300 }} className={scss.tippy_wrapper}>
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                visible={visible}
                interactive={true}
                placement="bottom-end"
                onClickOutside={() => {
                    setVisible(!visible);
                }}
                render={() => (
                    <TippyContent
                        visible={visible}
                        setCount={setCount}
                        setVisible={setVisible}
                        inventory={inventory}
                        opacity={opacity}
                    />
                )}
            >
                <div>
                    <span className={scss.tippy_desc}>По локациям</span>
                    <button
                        className={scss.tippy_button}
                        onClick={() => {
                            setVisible(true);
                        }}
                        type="button"
                    >
                        {count ? `Фильтры: ${count}` : 'Выберите фильтры'}
                    </button>
                </div>
            </Tippy>
        </div>
    );
};
