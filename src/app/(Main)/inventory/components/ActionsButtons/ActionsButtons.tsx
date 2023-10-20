'use client';

import React, { useEffect, useState } from 'react';

import { Button } from 'components/UI/Buttons/Button';
import { SelectLocationTippy } from 'app/(Main)/inventory/components/SelectLocationTippy';

import scss from 'app/(Main)/locations/components/KeysWrapper/KeysWrapper.module.scss';
import { NameInputSelect } from 'app/(Main)/components/NameInputSelect';
import { getClientInventories } from 'http/inventoryApi';
import { IInventory, IResponse } from 'http/types';
import { useSearchParams } from 'next/navigation';

interface ActionsButtonsProps {
    setVisible: (v: boolean) => void;
    setModalType: (v: 'one' | 'more') => void;
}

export const ActionsButtons: React.FC<ActionsButtonsProps> = ({
    setModalType,
    setVisible,
}) => {
    const searchParams = useSearchParams();
    const name = searchParams.get('name') ?? encodeURI('Все');

    const [inventories, setInventories] = useState<IResponse<IInventory>>();

    useEffect(() => {
        const fetchInventories = async () => {
            const res = await getClientInventories(name);
            return res;
        };
        fetchInventories().then((d) => {
            setInventories(d);
        });
    }, [name]);

    return (
        <>
            <div className={scss.inventory_actions_buttons_wrapper}>
                <div className={scss.inventory_buttons_wrapper}>
                    <div className={scss.name_input_wrapper}>
                        <NameInputSelect type="inventory" />
                    </div>
                    <SelectLocationTippy
                        inventory={inventories?.results as IInventory[]}
                    />
                </div>
                <div className={scss.generate_button_wrapper}>
                    <Button nowrap onClick={() => {}} type="button">
                        Скачать наклейки ШК
                    </Button>
                    <Button
                        nowrap
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
