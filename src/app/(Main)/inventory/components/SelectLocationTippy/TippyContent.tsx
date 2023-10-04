import { motion, MotionValue } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { InputSelect } from 'components/UI/Inputs/InputSelect';
import { getLocationsOnClient } from 'http/locationsApi';
import { ILocation } from 'http/types';
import { Spinner } from 'components/Spinner';

import scss from './SelectLocationInput.module.scss';
import { LocationsList } from 'app/(Main)/inventory/components/SelectLocationTippy/LocationsList/LocationsList';
import { Button } from 'components/UI/Buttons/Button';
import { toast } from 'react-toastify';

interface TippyContentProps {
    opacity: MotionValue<number>;
}

export const TippyContent: React.FC<TippyContentProps> = ({ opacity }) => {
    const [listValues, setListValues] = useState<ILocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState<ILocation>();
    const [selectedLocations, setSelectedLocations] = useState<ILocation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            return await getLocationsOnClient();
        };
        fetchData()
            .then((d) => {
                setListValues(d.results);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
    };

    const handleInputChange = (v: ILocation) => {
        setSelectedValue(v);
        setListValues((lv) => {
            return lv.filter((el) => el.id !== v.id);
        });
        setSelectedLocations((l) => {
            if (l.some((el) => el.id === v.id)) {
                return l;
            }
            return [...l, v];
        });
    };

    const handleSubmit = () => {
        if (selectedLocations.length === 0) {
            toast('Выберите локации', {
                position: 'top-left',
                hideProgressBar: true,
                autoClose: 2000,
                type: 'error',
                theme: 'colored',
            });
        }
    };

    return (
        <motion.div style={{ opacity }} className={scss.content_wrapper}>
            <div style={{ position: 'relative' }}>
                <p className={scss.tippy_title}>Укажите локацию</p>
                <InputSelect
                    needErrorLabel={false}
                    placeholder="Выберите локацию"
                    listValues={listValues}
                    name="locations"
                    onChange={(v: ILocation) => {
                        handleInputChange(v);
                    }}
                    value={selectedValue?.name as string}
                />
                <LocationsList
                    deleteOne={handleDeleteOne}
                    locations={selectedLocations}
                />
                <div className={scss.button_wrapper}>
                    <Button onClick={() => handleSubmit()} type="button">
                        Скачать
                    </Button>
                </div>
            </div>
            {loading && <Spinner />}
        </motion.div>
    );
};
