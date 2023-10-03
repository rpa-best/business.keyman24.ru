'use client';

import React from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { SelectLocationTippy } from 'app/(Main)/inventory/components/SelectLocationTippy';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';

interface ActionsButtonsProps {
    setVisible: (v: boolean) => void;
    setModalType: (v: 'one' | 'more') => void;
}

export const ActionsButtons: React.FC<ActionsButtonsProps> = ({
    setModalType,
    setVisible,
}) => {
    return (
        <>
            <div className={scss.actions_buttons_wrapper}>
                <div className={scss.actions_button}>
                    <SelectLocationTippy />
                </div>
                <div className={scss.actions_button}>
                    <Button
                        onClick={() => {
                            setVisible(true);
                            setModalType('more');
                        }}
                        type="button"
                    >
                        Сгенерировать инвентарь
                    </Button>
                </div>
            </div>
        </>
    );
};
