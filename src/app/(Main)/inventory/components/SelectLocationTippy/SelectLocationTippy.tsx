import React, { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import { onHide, onMount } from 'utils/TippyHelper';
import { useSpring } from 'framer-motion';
import { TippyContent } from 'app/(Main)/inventory/components/SelectLocationTippy/TippyContent';

import scss from './SelectLocationInput.module.scss';

export const SelectLocationTippy = () => {
    const [visible, setVisible] = useState(false);
    const opacity = useSpring(0);

    return (
        <div className={scss.tippy_wrapper}>
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
                render={() => <TippyContent />}
            >
                <button
                    className={scss.tippy_button}
                    onClick={() => {
                        setVisible(true);
                    }}
                    type="button"
                >
                    Скачать наклейки ШК
                </button>
            </Tippy>
        </div>
    );
};
