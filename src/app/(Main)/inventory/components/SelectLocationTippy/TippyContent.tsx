import { motion, MotionValue } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { getLocationsOnClient } from 'http/locationsApi';
import { IInventory, ILocation } from 'http/types';
import { Spinner } from 'components/Spinner';

import scss from './SelectLocationInput.module.scss';
import { LocationsList } from 'app/(Main)/inventory/components/SelectLocationTippy/LocationsList/LocationsList';
import { Button } from 'components/UI/Buttons/Button';
import { toast } from 'react-toastify';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setSearchParams } from 'utils/setSearchParams';
import { SearchParamsHelper } from 'utils/searchParamsHelper';

interface TippyContentProps {
    opacity: MotionValue<number>;
    inventory: IInventory[];
    setVisible: (v: boolean) => void;
    setCount: (str: string) => void;
    visible: boolean;
}

export const TippyContent: React.FC<TippyContentProps> = ({
    opacity,
    inventory,
    setVisible,
    setCount,
    visible,
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const name = searchParams.get('name');

    const unsavedChanges = useRef(true);

    const searchHelper = new SearchParamsHelper(searchParams.entries);

    const [listValues, setListValues] = useState<
        { id: number; name: string }[]
    >([]);
    const [selectedValue, setSelectedValue] = useState<{
        id: number;
        name: string;
    }>();
    const [selectedLocations, setSelectedLocations] = useState<
        { id: number; name: string }[]
    >([]);

    useEffect(() => {
        if (inventory) {
            const alreadyHas = new Set();
            const filteredNames = inventory?.reduce(
                (accumulator: { id: number; name: string }[], item) => {
                    if (item.location) {
                        if (!alreadyHas.has(item.location.name)) {
                            alreadyHas.add(item.location.name);
                            accumulator.push({
                                id: item.location.id,
                                name: item.location.name,
                            });
                        }
                    }
                    return accumulator;
                },
                []
            );
            setListValues(filteredNames);
        }
    }, [inventory]);

    useEffect(() => {
        if (!visible && unsavedChanges.current) {
            handleSubmit();
        }
    }, [visible, unsavedChanges.current]);

    useEffect(() => {
        setSelectedValue(undefined);
        setSelectedLocations([]);
    }, [name]);

    const handleDeleteOne = (id: number) => {
        setListValues((l) => {
            const elem = selectedLocations.find((el) => el.id === id);
            return [...l, elem as ILocation];
        });
        setSelectedLocations((l) =>
            l.filter((l) => {
                return l.id !== id;
            })
        );
        unsavedChanges.current = true;
    };

    const handleInputChange = (v: ILocation) => {
        setSelectedValue(v);

        setListValues((lv) => lv.filter((l) => l.id !== v.id));

        setSelectedLocations((l) => {
            if (l.some((el) => el.id === v.id)) {
                return l;
            }
            return [...l, v];
        });
    };

    const handleSubmit = () => {
        setCount(
            selectedLocations.length === 0
                ? ''
                : selectedLocations.length.toString()
        );
        setSelectedValue(undefined);

        const locationIds = selectedLocations
            .map((el) => el.id.toString())
            .join(',');
        if (!locationIds) {
            searchHelper.getParams.delete('location');
        } else {
            searchHelper.set('location', locationIds);
        }

        router.replace(pathname + `?${searchHelper.getParams}`);

        setVisible(false);
        unsavedChanges.current = false;
    };

    return (
        <motion.div style={{ opacity }} className={scss.content_wrapper}>
            <div style={{ position: 'relative' }}>
                <p className={scss.tippy_title}>Укажите локацию</p>
                <InputSelect
                    clearable
                    showPrevValue={false}
                    needErrorLabel={false}
                    placeholder="Выберите локацию"
                    listValues={listValues}
                    name="locations"
                    onChange={(v: ILocation) => {
                        handleInputChange(v);
                    }}
                    value={selectedValue?.name ?? ''}
                />
                <LocationsList
                    deleteOne={handleDeleteOne}
                    locations={selectedLocations}
                />
                <div className={scss.button_wrapper}>
                    <Button onClick={() => handleSubmit()} type="button">
                        Применить
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
